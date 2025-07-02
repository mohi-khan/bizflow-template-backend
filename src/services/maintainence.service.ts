import { eq, sql } from "drizzle-orm";
import { db } from "../config/database";
import { BadRequestError } from "./utils/errors.utils";
import { assetModel, maintenanceModel,NewAssetMaint } from "../schemas";





export const createMaintainance = async (
  maintainanceData: NewAssetMaint
) => {
  try {
    const [newMaintainance] = await db.insert(maintenanceModel).values(
      maintainanceData
    );

    return newMaintainance;
  } catch (error) {
    throw error;
  }
};
//Helper funciton for Get All Maintainances
export const getAllMaintainance = async () => {
  const maintainances = await db.select({
    id: maintenanceModel.id,
    asset_id: maintenanceModel.assetId,
    asset_des:sql`${assetModel.assetCode} || '-' || ${assetModel.assetName}`.as("asset_des"),
    type:maintenanceModel.type,
    maintDate: maintenanceModel.maintDate,
    cost: maintenanceModel.cost,
    performedBy: maintenanceModel.performedBy, 
    description: maintenanceModel.description,

  }).from(maintenanceModel)
  .innerJoin(assetModel,eq(maintenanceModel.assetId,assetModel.id))
  ;
  return maintainances;
};

// Helper function to get maintainance by ID
export const getMaintainanceById = async (maintainanceId: number) => {
    const maintainance =  await db.select({
    id: maintenanceModel.id,
    asset_id: maintenanceModel.assetId,
    asset_des:sql`${assetModel.assetCode} || '-' || ${assetModel.assetName}`.as("asset_des"),
    type:maintenanceModel.type,
    maintDate: maintenanceModel.maintDate,
    cost: maintenanceModel.cost,
    performedBy: maintenanceModel.performedBy, 
    description: maintenanceModel.description,

  }).from(maintenanceModel)
  .innerJoin(assetModel,eq(maintenanceModel.assetId,assetModel.id))
  .where(eq(maintenanceModel.assetId, maintainanceId))
   .limit(1);

    if (!maintainance.length) {
        throw BadRequestError("Maintainance not found");
    }

    return maintainance[0];
};

// Helper function to get maintainance by Asset ID
export const getMaintainanceByAssetId = async (assetId: number) => {
    const maintainance = await db.select({
        id: maintenanceModel.id,
        asset_id: maintenanceModel.assetId,
        asset_des: sql`${assetModel.assetCode} || '-' || ${assetModel.assetName}`.as("asset_des"),
        type: maintenanceModel.type,
        maintDate: maintenanceModel.maintDate,
        cost: maintenanceModel.cost,
        performedBy: maintenanceModel.performedBy,
        description: maintenanceModel.description,
    })
        .from(maintenanceModel)
        .innerJoin(assetModel, eq(maintenanceModel.assetId, assetModel.id))
        .where(eq(maintenanceModel.assetId, assetId));

    return maintainance;
};


//Helper funciton for Update Maintainance


export const editMaintainance = async (
    maintainanceId: number,
    maintainanceData: Partial<NewAssetMaint>
) => {
    const [updatedMaintainance] = await db
        .update(maintenanceModel)
        .set({
            ...maintainanceData,
         
        })
        .where(eq(maintenanceModel.id, maintainanceId))

    return updatedMaintainance;
};