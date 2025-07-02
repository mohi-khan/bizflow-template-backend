import { and, eq, gte, lt } from "drizzle-orm"
import { db } from "../../config/database"
import { assetModel, depreciationBookModel, depreciationInfoModel, depreciationTransactionModel, NewDepTrac } from "../../schemas"
import { getPeriod } from "../utils/common.utils"
import { BadRequestError } from "../utils/errors.utils"

type CompanyDepreciationParams = {
  company_id: number
  depreciation_date: Date
  book_id:number
  saveToDatabase?: boolean // Parameter to control database insertion
}

export const calculateCompanyDepreciation = async (params: CompanyDepreciationParams) => {
  try {
    const { company_id, depreciation_date,book_id, saveToDatabase = true } = params

    // 1. Fetch all assets for the company
    const assets = await db
      .select({
        assetId:assetModel.id,
        assetName:assetModel.assetName,
        purDate:assetModel.purDate,
        assetCode:assetModel.assetCode,
        depreciationRate:depreciationInfoModel.depreciationRate,
        effectiveDate:depreciationInfoModel.effectiveDate,
        bookId:depreciationInfoModel.bookId,
        bookName:depreciationBookModel.name,
        depreciationMethod:depreciationInfoModel.depreciationMethod,
        startingValue:depreciationInfoModel.startingValue,
        residualValue:depreciationInfoModel.residualValue,
        accDepValue:depreciationInfoModel.accDepValue,
        usefulLiefeMonths:depreciationInfoModel.usefulLifeMonths
      })
      .from(assetModel)
      .innerJoin(depreciationInfoModel,eq(assetModel.id,depreciationInfoModel.assetId))
      .innerJoin(depreciationBookModel,eq(depreciationInfoModel.bookId,depreciationBookModel.id))
      .where(and(eq(assetModel.companyId, company_id), eq(assetModel.status, "Active"),eq(depreciationInfoModel.bookId,book_id)))

    if (!assets.length) {
      return []
    }
    //console.log(assets.length)
    // Helper function to check if date is after 15th of the month
const isAfterMidMonth = (date: Date): boolean => {
  return date.getDate() > 15
}

  const shouldRunDepreciation = (purchaseDate: Date, depreciationDate: Date): boolean => {
  const purchaseMonth = purchaseDate.getMonth()+1
  const purchaseYear = purchaseDate.getFullYear()

  const firstDepreciationMonth = isAfterMidMonth(purchaseDate) ? purchaseMonth+1: purchaseMonth 
  const firstDepreciationYear = purchaseYear + (firstDepreciationMonth > 11 ? 1 : 0)

  const firstDepreciationDate = getLastDayOfMonth(firstDepreciationYear, firstDepreciationMonth)

  // If depreciation date is before the first depreciation date, don't run
  return depreciationDate >= firstDepreciationDate
}
   //  Gets the last day of a given month
    const getLastDayOfMonth = (year: number, month: number):Date => {
      return new Date(Date.UTC(year, month, 0, 23, 59, 59, 999));
}
    // Ensure the depreciation date is the last day of the month
    const depreciationYear = depreciation_date.getFullYear()
    const depreciationMonth = depreciation_date.getMonth()
    const normalizedDepreciationDate = getLastDayOfMonth(depreciationYear, depreciationMonth+1  )

    // 2. Calculate depreciation for each asset
const depreciationSchedulesToCreate: (NewDepTrac & { assetName: string,bookName:String })[] = [];
    console.log(normalizedDepreciationDate, "normalizedDepreciationDate")
    // check if depricaiton for this period
    const dep=await getDepreciationByPeriodAndBookId(getPeriod(normalizedDepreciationDate),book_id)
   if (dep.length > 0) {
    throw  BadRequestError(`Depreciation for this period 
      has already been run for the period + ${getPeriod(normalizedDepreciationDate)}` );
  }
  let i=0;
  let p=0;
  let q=0;
    for (const asset of assets) {
      // Skip assets without depreciation rate
      if (!asset.depreciationRate) {
        p++;
        continue
      }
      if (asset.accDepValue >= asset.startingValue){
        q++;
        continue;
      }
      // Skip assets that shouldn't be depreciated yet based on purchase date
      if (asset.purDate && !shouldRunDepreciation(asset.effectiveDate, normalizedDepreciationDate)) {
    
          i++;
          continue
      }
      console.log('çalculating Asset',asset.assetCode)
      let depreciationAmount = 0
      let accumulatedDepreciation = 0
      let remainingValue = 0

      // Get previous depreciation schedule for this asset to calculate accumulated depreciation
   

        accumulatedDepreciation = asset.accDepValue
      
        const originalValue = asset.startingValue
        const salvageValue = asset.residualValue ?? 0
        const usefullifemonths =asset.usefulLiefeMonths ?? 0
        const depreciationRate = asset.depreciationRate
        
      // Calculate depreciation based on method
      if (asset.depreciationMethod === "Straight Line") {
        

        // Calculate annual depreciation and then divide by 12 for monthly
        console.log(originalValue,salvageValue,usefullifemonths)
        depreciationAmount = ((originalValue-salvageValue)/usefullifemonths)
      } else if (asset.depreciationMethod === "Declining Balance") {
        // For diminishing balance, we need to calculate based on the remaining value
        const rate = depreciationRate ?? 0;
        depreciationAmount = ((originalValue - accumulatedDepreciation) * rate /100)/12

        // Ensure we don't calculate negative depreciation
        if (depreciationAmount < 0) {
          depreciationAmount = 0
        }
      }

      // Calculate new accumulated depreciation and remaining value
     
      remainingValue = originalValue - depreciationAmount

      // Ensure we don't depreciate below salvage value
     
        if (remainingValue <= salvageValue) {
          remainingValue = salvageValue
          depreciationAmount =
            accumulatedDepreciation + depreciationAmount > originalValue - salvageValue
              ? originalValue - salvageValue - accumulatedDepreciation
              : depreciationAmount

          if (depreciationAmount < 0) depreciationAmount = 0
        }
      
        
      
      depreciationSchedulesToCreate.push({
        assetId: asset.assetId,
        assetName:asset.assetName,
        bookId: asset.bookId,
        bookName:asset.bookName,
        transactionDate: normalizedDepreciationDate,
        period:getPeriod(normalizedDepreciationDate),
        depreciationAmount: depreciationAmount,
        createdBy: 0,
       
      });

  
    }
    console.log('Total skipped Asset:',i)
    console.log('Total Zero Dep Rate:',p)
    console.log('Total Skipped due to wdb is zero:',q)
    // 3. Insert all depreciation schedules if saveToDatabase is true
    if (saveToDatabase && depreciationSchedulesToCreate.length > 0) {
      // Just perform the insert without trying to destructure the result
      await db.insert(depreciationTransactionModel).values(depreciationSchedulesToCreate)
    }

    return depreciationSchedulesToCreate
  } catch (error) {
    throw error
  }
}

export const getAllDepreciation = async () => {
  try {
    const depreciation = await db
      .select()
      .from(depreciationTransactionModel);
    return depreciation;
  } catch (error) {
    throw error;
  }
}

export const getAllDepreciationByAssetId = async (assetId: number) => {
  try {
    const depreciation = await db
      .select({
        id: depreciationTransactionModel.id,
        asset_id: depreciationTransactionModel.assetId,
        book_id: depreciationTransactionModel.bookId,
        asset_name: assetModel.assetName,
        book_name: depreciationBookModel.name,
        transaction_date: depreciationTransactionModel.transactionDate,
        period: depreciationTransactionModel.period,
        depreciation_amount: depreciationTransactionModel.depreciationAmount,
        created_by: depreciationTransactionModel.createdBy
      })
      .from(depreciationTransactionModel)
      .leftJoin(assetModel, eq(depreciationTransactionModel.assetId, assetModel.id))
      .leftJoin(depreciationBookModel, eq(depreciationTransactionModel.bookId, depreciationBookModel.id))
      .where(eq(depreciationTransactionModel.assetId, assetId));
    return depreciation;
  } catch (error) {
    throw error;
  }
}

export const getDepreciationByPeriodAndBookId = async (period: string, bookId: number) => {
  try {
    console.log('period',period)
    console.log('bookId',bookId)
    const depreciation = await db
      .select({
        id: depreciationTransactionModel.id,
        asset_id: depreciationTransactionModel.assetId,
        book_id: depreciationTransactionModel.bookId,
        asset_name: assetModel.assetName,
        book_name: depreciationBookModel.name,
        transaction_date: depreciationTransactionModel.transactionDate,
        period: depreciationTransactionModel.period,
        depreciation_amount: depreciationTransactionModel.depreciationAmount,
        created_by: depreciationTransactionModel.createdBy,
        depreciation_rate: depreciationInfoModel.depreciationRate,
        depreciation_method: depreciationInfoModel.depreciationMethod,
        useful_life_months: depreciationInfoModel.usefulLifeMonths,
        residual_value: depreciationInfoModel.residualValue,
        current_value: depreciationInfoModel.startingValue,
        acc_dep: depreciationInfoModel.accDepValue
      })
      .from(depreciationTransactionModel)
      .leftJoin(assetModel, eq(depreciationTransactionModel.assetId, assetModel.id))
      .leftJoin(depreciationBookModel, eq(depreciationTransactionModel.bookId, depreciationBookModel.id))
      .leftJoin(depreciationInfoModel, and(
        eq(depreciationTransactionModel.assetId, depreciationInfoModel.assetId)
      ))
      .where(
        and(
          eq(depreciationTransactionModel.period, period),
          eq(depreciationTransactionModel.bookId, bookId)
        )
      );

    return depreciation;
  } catch (error) {
    throw error;
  }
};