import { eq, sql } from "drizzle-orm";
import { db } from "../config/database";
import { BadRequestError } from "./utils/errors.utils";
import { assetModel, NewAssetAddition, assetCapexAdditionModel } from "../schemas";




export const createAssetAddition = async (
  assetAdditionData: NewAssetAddition
) => {
  try {
    const [newAssetAddition] = await db.insert(assetCapexAdditionModel).values(
      assetAdditionData
    );

    return newAssetAddition;
  } catch (error) {
    throw error;
  }
};
//Helper funciton for Get All AssetAdditions
export const getAllAssetAddition = async () => {
  const assetAdditions = await db.select({
    id: assetCapexAdditionModel.id,
    asset_id: assetCapexAdditionModel.assetId,
    asset_des:sql`${assetModel.assetCode} || '-' || ${assetModel.assetName}`.as("asset_des"),
    description:assetCapexAdditionModel.description,
    additionDate: assetCapexAdditionModel.additionDate,
    addedValue: assetCapexAdditionModel.addedValue, // address + phone + email


  }).from(assetCapexAdditionModel)
  .innerJoin(assetModel,eq(assetCapexAdditionModel.assetId,assetModel.id))
  ;
  return assetAdditions;
};

// Helper function to get assetAddition by ID
export const getAssetAdditionById = async (assetId: number) => {
    const assetAddition = await db.select({
    id: assetCapexAdditionModel.id,
    asset_id: assetCapexAdditionModel.assetId,
    asset_des:sql`${assetModel.assetCode} || '-' || ${assetModel.assetName}`.as("asset_des"),
    description:assetCapexAdditionModel.description,
    additionDate: assetCapexAdditionModel.additionDate,
    addedValue: assetCapexAdditionModel.addedValue, // address + phone + email


  }).from(assetCapexAdditionModel)
  .innerJoin(assetModel,eq(assetCapexAdditionModel.assetId,assetModel.id))
   .where(eq(assetCapexAdditionModel.assetId, assetId))
   .limit(1);

    if (!assetAddition.length) {
        throw BadRequestError("AssetAddition not found");
    }

    return assetAddition[0];
};
//Helper funciton for Update AssetAddition


export const editAssetAddition = async (
    assetAdditionId: number,
    assetAdditionData: Partial<NewAssetAddition>
) => {
    const [updatedAssetAddition] = await db
        .update(assetCapexAdditionModel)
        .set({
            ...assetAdditionData,
         
        })
        .where(eq(assetCapexAdditionModel.id, assetAdditionId))

    return updatedAssetAddition;
};