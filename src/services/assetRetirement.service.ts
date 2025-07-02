import { eq, sql } from "drizzle-orm";
import { db } from "../config/database";
import { BadRequestError } from "./utils/errors.utils";
import { assetModel, NewAssetRetirement, assetPartialRetirementModel } from "../schemas";




export const createAssetRetirement = async (
  assetRetirementData: NewAssetRetirement
) => {
  try {
    const [newAssetRetirement] = await db.insert(assetPartialRetirementModel).values(
      assetRetirementData
    );

    return newAssetRetirement;
  } catch (error) {
    throw error;
  }
};
//Helper funciton for Get All AssetRetirements
export const getAllAssetRetirement = async () => {
  const assetRetirements = await db.select({
    id: assetPartialRetirementModel.id,
    asset_id: assetPartialRetirementModel.assetId,
    asset_des:sql`${assetModel.assetCode} || '-' || ${assetModel.assetName}`.as("asset_des"),
    reason:assetPartialRetirementModel.reason,
    retirementDate: assetPartialRetirementModel.retirementDate,
    retiredValue: assetPartialRetirementModel.retiredValue, // address + phone + email


  }).from(assetPartialRetirementModel)
  .innerJoin(assetModel,eq(assetPartialRetirementModel.assetId,assetModel.id))
  ;
  return assetRetirements;
};

// Helper function to get assetRetirement by ID
export const getAssetRetirementById = async (assetId: number) => {
    const assetRetirement = await db.select({
    id: assetPartialRetirementModel.id,
    asset_id: assetPartialRetirementModel.assetId,
    asset_des:sql`${assetModel.assetCode} || '-' || ${assetModel.assetName}`.as("asset_des"),
    reason:assetPartialRetirementModel.reason,
    retirementDate: assetPartialRetirementModel.retirementDate,
    retiredValue: assetPartialRetirementModel.retiredValue, 


  }).from(assetPartialRetirementModel)
  .innerJoin(assetModel,eq(assetPartialRetirementModel.assetId,assetModel.id))
   .where(eq(assetPartialRetirementModel.assetId, assetId))
   .limit(1);

    if (!assetRetirement.length) {
        throw BadRequestError("AssetRetirement not found");
    }

    return assetRetirement[0];
};
//Helper funciton for Update AssetRetirement


export const editAssetRetirement = async (
    assetRetirementId: number,
    assetRetirementData: Partial<NewAssetRetirement>
) => {
    const [updatedAssetRetirement] = await db
        .update(assetPartialRetirementModel)
        .set({
            ...assetRetirementData,
         
        })
        .where(eq(assetPartialRetirementModel.id, assetRetirementId))

    return updatedAssetRetirement;
};