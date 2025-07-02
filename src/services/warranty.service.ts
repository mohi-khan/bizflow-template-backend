import { eq, sql } from "drizzle-orm";
import { db } from "../config/database";
import { BadRequestError } from "./utils/errors.utils";
import { assetModel, NewAssetWarranty, warrantyModel } from "../schemas";




export const createWarranty = async (
  warrantyData: NewAssetWarranty
) => {
  try {
    const [newWarranty] = await db.insert(warrantyModel).values(
      warrantyData
    );

    return newWarranty;
  } catch (error) {
    throw error;
  }
};
//Helper funciton for Get All Warrantys
export const getAllWarranty = async () => {
  const warrantys = await db.select({
    id: warrantyModel.id,
    asset_id: warrantyModel.asset_id,
    asset_des:sql`${assetModel.assetCode} || '-' || ${assetModel.assetName}`.as("asset_des"),
    type:warrantyModel.type,
    start_date: warrantyModel.start_date,
    end_date: warrantyModel.end_date,
    warranty_provider: warrantyModel.warranty_provider, // address + phone + email
    description: warrantyModel.description,

  }).from(warrantyModel)
  .innerJoin(assetModel,eq(warrantyModel.asset_id,assetModel.id))
  ;
  return warrantys;
};

// Helper function to get warranty by ID
export const getWarrantyById = async (warrantyId: number) => {
    const warranty = await db.select({
    id: warrantyModel.id,
    asset_id: warrantyModel.asset_id,
    asset_des:sql`${assetModel.assetCode} || '-' || ${assetModel.assetName}`.as("asset_des"),
    type:warrantyModel.type,
    start_date: warrantyModel.start_date,
    end_date: warrantyModel.end_date,
    warranty_provider: warrantyModel.warranty_provider, // address + phone + email
    description: warrantyModel.description,

  }).from(warrantyModel)
  .innerJoin(assetModel,eq(warrantyModel.asset_id,assetModel.id))
   .where(eq(warrantyModel.asset_id, warrantyId))
   .limit(1);

    if (!warranty.length) {
        throw BadRequestError("Warranty not found");
    }

    return warranty[0];
};

// Helper function to get warranty by Asset ID
export const getWarrantyByAssetId = async (assetId: number) => {
    const warranty = await db.select({
    id: warrantyModel.id,
    asset_id: warrantyModel.asset_id,
    asset_des:sql`${assetModel.assetCode} || '-' || ${assetModel.assetName}`.as("asset_des"),
    type:warrantyModel.type,
    start_date: warrantyModel.start_date,
    end_date: warrantyModel.end_date,
    warranty_provider: warrantyModel.warranty_provider,
    description: warrantyModel.description,
  }).from(warrantyModel)
  .innerJoin(assetModel,eq(warrantyModel.asset_id,assetModel.id))
  .where(eq(warrantyModel.asset_id, assetId));

  return warranty;
};


//Helper funciton for Update Warranty


export const editWarranty = async (
    warrantyId: number,
    warrantyData: Partial<NewAssetWarranty>
) => {
    const [updatedWarranty] = await db
        .update(warrantyModel)
        .set({
            ...warrantyData,
         
        })
        .where(eq(warrantyModel.id, warrantyId))

    return updatedWarranty;
};