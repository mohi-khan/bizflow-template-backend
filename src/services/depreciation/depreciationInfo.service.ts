import { and, eq } from "drizzle-orm";
import { db } from "../../config/database";
import { assetModel, depreciationBookModel, depreciationInfoModel, NewDepInfo } from "../../schemas";
import { BadRequestError } from "../utils/errors.utils";



export const createDepInfo = async (
  depInfoData: NewDepInfo
) => {
  try {
    const existing = await db
      .select()
      .from(depreciationInfoModel)
      .where(
        and(
          eq(depreciationInfoModel.bookId, depInfoData.bookId),
          eq(depreciationInfoModel.assetId, depInfoData.assetId)
        )
      )
      .limit(1);

    if (existing.length > 0) {
      throw BadRequestError("Depreciation info already exists for this Asset and Book.");
    }
    const [newDepInfo] = await db.insert(depreciationInfoModel).values(
      depInfoData
    );

    return newDepInfo;
  } catch (error) {
    throw error;
  }
};
//Helper funciton for Get All DepInfos
export const getAllDepInfos = async () => {
  const depInfos = await db.select().from(depreciationInfoModel);
  return depInfos;
};

//Function to get DepInfo by Asset_id

export const getAllDepInfosbyAssetId = async (assetId:number) => {
  const depInfos = await db.select(
    {
       bookName:depreciationBookModel.name,
       method:depreciationInfoModel.depreciationMethod,
       rate:depreciationInfoModel.depreciationRate,
       usefullLife:depreciationInfoModel.usefulLifeMonths,
       assetValue:depreciationInfoModel.startingValue,
       accDep:depreciationInfoModel.accDepValue,
       salvageValue:depreciationInfoModel.residualValue,
       effectiveDate:depreciationInfoModel.effectiveDate,
       Frequency:depreciationBookModel.depFreq
    }
  ).from(depreciationInfoModel)
  .innerJoin
  (assetModel,(eq(depreciationInfoModel.assetId,assetModel.id)))
  .innerJoin(
    depreciationBookModel,(eq(depreciationInfoModel.bookId,depreciationBookModel.id))
  )
  .where(eq(depreciationInfoModel.assetId,assetId));
  return depInfos;
};

// Helper function to get depInfo by ID
export const getDepInfoById = async (depInfoId: number) => {
    const depInfo = await db
        .select()
        .from(depreciationInfoModel)
        .where(eq(depreciationInfoModel.id, depInfoId))
        .limit(1);

    if (!depInfo.length) {
        throw BadRequestError("DepInfo not found");
    }

    return depInfo[0];
};
//Helper funciton for Update DepInfo


export const editDepInfo = async (
    depInfoId: number,
    depInfoData: Partial<NewDepInfo>
) => {
    const [updatedDepInfo] = await db
        .update(depreciationInfoModel)
        .set({
            ...depInfoData,
         
        })
        .where(eq(depreciationInfoModel.id, depInfoId))

    return updatedDepInfo;
};