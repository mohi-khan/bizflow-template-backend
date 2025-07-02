import { z } from "zod";
import { db } from "../config/database";
import { assetCategoryModel, assetModel, costCenterModel, deparmentModel, depreciationBookModel, depreciationInfoModel, depreciationTransactionModel, locationModel, supplierModel } from "../schemas";
import { and, eq, sql } from "drizzle-orm";
import { alias } from "drizzle-orm/mysql-core";

type reportParams={
  companyId: number,
  bookId: number,
  period: string,
}
export const catWiseDepReport=async(param:reportParams)=>{
  const parent = alias(assetCategoryModel, "parent");
  const dataList= await db
  .select({
    subCategory: assetCategoryModel.category_name,
    parentCategory: parent.category_name,
    totalDepreciation: sql<number>`SUM(${depreciationTransactionModel.depreciationAmount})`,
  })
  .from(depreciationTransactionModel)
  .innerJoin(assetModel, eq(depreciationTransactionModel.assetId, assetModel.id))
  .innerJoin(assetCategoryModel, eq(assetModel.categoryId, assetCategoryModel.category_id))
  .innerJoin(
    parent,
    eq(assetCategoryModel.parent_cat_code, parent.category_id)
  )
  .where(
    and(
      eq(depreciationTransactionModel.period, param.period),
      eq(depreciationTransactionModel.bookId, param.bookId),
      eq(assetModel.companyId,param.companyId)
    )
  )
  .groupBy(
    assetCategoryModel.category_name,
    parent.category_name
  );
  return dataList;
}

export const costCenterRept=async(param:reportParams)=>{
    try{
        const dataList=await db.select({
            period:depreciationTransactionModel.period,
            asset_gl:assetModel.assetGlCode,
            costCenterCode:costCenterModel.costCenterName,
            totalDepreciation: sql<number>`SUM(${depreciationTransactionModel.depreciationAmount})`.as('totalDepreciation'),
        }).from(depreciationTransactionModel)
        .innerJoin(assetModel,eq(depreciationTransactionModel.assetId,assetModel.id))
        .innerJoin(costCenterModel,eq(assetModel.costCenterId,costCenterModel.costCenterId))
        .where(and(
            eq(assetModel.companyId,param.companyId),
            eq(depreciationTransactionModel.bookId,param.bookId),
            eq(depreciationTransactionModel.period,param.period)
        )).groupBy(assetModel.assetGlCode,costCenterModel.costCenterName,depreciationTransactionModel.period)
     return dataList;
  } catch (error) {
    throw error;
  }
} 

type AssetInfoParams = {
  companyId: number
}

export const assetInfoReport = async (param: AssetInfoParams) => {
  try {
    const dataList = await db.select({
      item_code: assetModel.assetCode,
      item_desc: assetModel.assetName,
      // mfg_code: assetModel.mfgCode,
      mfg_name: supplierModel.name,
      c_origin: assetModel.countryCode,
      m_model: assetModel.model,
      // mfg_yy: assetModel.mfgYear,
      mc_sl: assetModel.slNo,
      mc_loc: assetModel.locationId,
      comm_dt: assetModel.startDate,
      mc_sup: assetModel.supplierId,
      supplier_name: supplierModel.name,
      a_loc: assetModel.locationId,
      a_sec: assetModel.sectionId,
      a_cat: assetModel.categoryId,
      a_dept: assetModel.departmentId,
      a_st: assetModel.status,
      // a_value: assetModel.assetValue,
      curr_value: depreciationInfoModel.startingValue,
      l_time: depreciationInfoModel.usefulLifeMonths,
      d_pct: depreciationInfoModel.depreciationRate,
      // yy_dep: assetModel.yearlyDepreciation,
      // accu_dep_o: assetModel.openingAccumulatedDepreciation, 
      accu_dep: depreciationInfoModel.accDepValue,
      b_value: depreciationInfoModel.bookId,
      b_name: depreciationBookModel.name,
      a_scat: assetModel.categoryId,
      cc_code: costCenterModel.costCenterId,
      cc_desc: costCenterModel.costCenterName,
      // oh_amt: assetModel.overhaulAmount,
      // oh_l_time: assetModel.overhaulLifeTime,
      // oh_dt: assetModel.overhaulDate,
      // r_l_time: assetModel.remainingLife,
      // u_l_time: assetModel.usefulLife,
      // u_accu_dep: assetModel.updatedAccumulatedDepreciation,
      a_st_dt: assetModel.startDate,
      // s_amt: assetModel.soldValue,
      // a_rem: assetModel.remarks,
      // sold_dt: assetModel.soldDate    
    }).from(assetModel)
    .innerJoin(costCenterModel, eq(assetModel.costCenterId, costCenterModel.costCenterId))
    .innerJoin(supplierModel, eq(assetModel.supplierId, supplierModel.id))
    .innerJoin(depreciationInfoModel, eq(assetModel.id, depreciationInfoModel.assetId))
    .innerJoin(depreciationBookModel, eq(depreciationInfoModel.bookId, depreciationBookModel.id))
    .where(eq(assetModel.companyId, param.companyId));

    return dataList;
  } catch (error) {
    throw error;
  }
}

export const catWiseMonthlyDepReport = async (param: reportParams) => {
  const parent = alias(assetCategoryModel, "parent")
  const dataList = await db
    .select({
      subCategory: assetCategoryModel.category_name,
      parentCategory: parent.category_name,
      totalDepreciation: sql<number>`SUM(${depreciationTransactionModel.depreciationAmount})`,
    })
    .from(depreciationTransactionModel)
    .innerJoin(assetModel, eq(depreciationTransactionModel.assetId, assetModel.id))
    .innerJoin(assetCategoryModel, eq(assetModel.categoryId, assetCategoryModel.category_id))
    .innerJoin(
      parent,
      eq(assetCategoryModel.parent_cat_code, parent.category_id)
    )
    .where(and(
            eq(assetModel.companyId,param.companyId),
            eq(depreciationTransactionModel.bookId,param.bookId),
            eq(depreciationTransactionModel.period,param.period)
        ))
    .groupBy(
      assetCategoryModel.category_name,
      parent.category_name
    )

  return dataList
}

export const monthlyDepreciationInfoReport = async (param: reportParams) => {
  try {
    const dataList = await db.select({
      code: assetModel.assetCode,
      description: assetModel.assetName,
      commencement: assetModel.startDate,
      subCategory: assetCategoryModel.category_name,
      locationId: assetModel.locationId,
      location: locationModel.name,
      departmentId: assetModel.departmentId,
      department: deparmentModel.departmentName,
      // actualValue: assetModel.assetValue,
      currentValue: depreciationInfoModel.startingValue,
      usefulLife: depreciationInfoModel.usefulLifeMonths,
      depreciationPercentage: depreciationInfoModel.depreciationRate,
      depreciation: depreciationTransactionModel.depreciationAmount, 
    }).from(assetModel)
    .innerJoin(costCenterModel, eq(assetModel.costCenterId, costCenterModel.costCenterId))
    .innerJoin(supplierModel, eq(assetModel.supplierId, supplierModel.id))
    .innerJoin(depreciationInfoModel, eq(assetModel.id, depreciationInfoModel.assetId))
    .innerJoin(depreciationBookModel, eq(depreciationInfoModel.bookId, depreciationBookModel.id))
    .innerJoin(locationModel, eq(assetModel.locationId, locationModel.id))
    .innerJoin(assetCategoryModel, eq(assetModel.categoryId, assetCategoryModel.category_id))
    .innerJoin(depreciationTransactionModel, eq(assetModel.id, depreciationTransactionModel.assetId))
    .innerJoin(deparmentModel, eq(assetModel.departmentId, deparmentModel.departmentID))
    .where(eq(assetModel.companyId, param.companyId))

    return dataList
  } catch (error) {
    throw error
  }
}