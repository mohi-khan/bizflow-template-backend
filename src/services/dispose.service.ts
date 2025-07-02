import { and, eq, sql } from "drizzle-orm";
import { db } from "../config/database";
import { BadRequestError } from "./utils/errors.utils";
import { assetModel, NewAssetDispose, disposeModel } from "../schemas";




export const createDispose = async (
  disposeData: NewAssetDispose
) => {
  try {
    const [newDispose] = await db.insert(disposeModel).values(
      disposeData
    );

    return newDispose;
  } catch (error) {
    throw error;
  }
};
//Helper funciton for Get All Disposes
export const getAllDispose = async () => {
  const disposes = await db.select({
    id: disposeModel.id,
    asset_id: disposeModel.asset_id,
    asset_name: assetModel.assetName,
    value: disposeModel.value,
    asset_des:sql`${assetModel.assetCode} || '-' || ${assetModel.assetName}`.as("asset_des"),
    method:disposeModel.method,
    dispose_date: disposeModel.dispose_date,
    performed_by: disposeModel.performed_by, 
    reason: disposeModel.reason,
    remarks: disposeModel.remarks,

  }).from(disposeModel)
  .innerJoin(assetModel,eq(disposeModel.asset_id,assetModel.id))
  return disposes;
};

export const getDisposeByDisposeDateAndCompany = async (disposeDate: string, companyId: number) => {
  try {
    const dateObj = new Date(disposeDate);
    const disposes = await db.select({
      id: disposeModel.id,
      asset_id: disposeModel.asset_id,
      asset_name: assetModel.assetName,
      value: disposeModel.value,
      method: disposeModel.method,
      dispose_date: disposeModel.dispose_date,
      performed_by: disposeModel.performed_by,
      reason: disposeModel.reason,
      remarks: disposeModel.remarks,
    })
    .from(disposeModel)
    .innerJoin(assetModel, eq(disposeModel.asset_id, assetModel.id))
    .where(
      and(
        eq(sql`DATE(${disposeModel.dispose_date})`, sql`DATE(${dateObj})`),
        eq(assetModel.companyId, companyId)
      )
    );

    return disposes;
  } catch (error) {
    throw error;
  }
};// Helper function to get dispose by ID
export const getDisposeById = async (disposeId: number) => {
    const dispose = await db.select({
    id: disposeModel.id,
    asset_id: disposeModel.asset_id,
    asset_des:sql`${assetModel.assetCode} || '-' || ${assetModel.assetName}`.as("asset_des"),
    method:disposeModel.method,
    dispose_date: disposeModel.dispose_date,
    performed_by: disposeModel.performed_by, 
    reason: disposeModel.reason,
    remarks: disposeModel.remarks,

  }).from(disposeModel)
  .innerJoin(assetModel,eq(disposeModel.asset_id,assetModel.id))
   .where(eq(disposeModel.id, disposeId))
   .limit(1);

    if (!dispose.length) {
        throw BadRequestError("Dispose not found");
    }

    return dispose[0];
};
//Helper funciton for Update Dispose


export const editDispose = async (
    disposeId: number,
    disposeData: Partial<NewAssetDispose>
) => {
    const [updatedDispose] = await db
        .update(disposeModel)
        .set({
            ...disposeData,
         
        })
        .where(eq(disposeModel.id, disposeId))

    return updatedDispose;
};