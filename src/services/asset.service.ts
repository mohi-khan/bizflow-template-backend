import { count, eq } from "drizzle-orm";


import { alias } from "drizzle-orm/mysql-core";
import { assetCategoryModel, assetModel, costCenterModel, countryModel, deparmentModel, locationModel, NewAsset, sectionModel, supplierModel, userModel } from "../schemas";
import { db } from "../config/database";
import { BadRequestError } from "./utils/errors.utils";
import { start } from "repl";
import { create } from "domain";

export const createAsset = async (assetData: NewAsset) => {
  try {
    const [newAsset] = await db
      .insert(assetModel)
      .values(assetData)
      .execute();
   
    return newAsset;
  } catch (error) {
    throw error;
  }
};

export const getAllAsset = async () => {
  const ManufactureTable=alias(supplierModel,'ManufacturerModel');
  const assetData = await db.select({
    id: assetModel.id,
    assetCode: assetModel.assetCode,
    assetName: assetModel.assetName,
    // assetValue: assetModel.assetValue,
    categoryId: assetModel.categoryId,
    categoryName: assetCategoryModel.category_name,
    country: countryModel.name,
    // assetDepStartValue:assetModel.currentValue,
    // depRate:assetModel.depRate,
    departmentId: assetModel.departmentId,
    departmentName:deparmentModel.departmentName,
    companyId: assetModel.companyId,
    locationId: assetModel.locationId,
    locationName :locationModel.name,
    sectionName :sectionModel.name,
    // salvageValue:assetModel.salvageValue,
    status:assetModel.status,
    // manufacure:ManufactureTable.name,
    // soldDate: assetModel.soldDate,
    purDate: assetModel.purDate,
    // soldValue: assetModel.soldDate,
    // mfgYear: assetModel.mfgYear,
    model: assetModel.model,
    slNo: assetModel.slNo,
    costCenter:costCenterModel.costCenterName,
    assetGlCode: assetModel.assetGlCode,
    notes: assetModel.notes,
    user: assetModel.user,
    createdBy: assetModel.createdBy,
  }).from(assetModel)
    .leftJoin(
      assetCategoryModel, 
      eq(assetModel.categoryId, assetCategoryModel.category_id)
    ).leftJoin(
      deparmentModel,
      eq(assetModel.departmentId,deparmentModel.departmentID)
    ).leftJoin(
        locationModel,
        eq(assetModel.locationId,locationModel.id)
      ).leftJoin(
        sectionModel,
        eq(assetModel.sectionId,sectionModel.id)
      ).leftJoin(
        costCenterModel,
        eq(assetModel.costCenterId,costCenterModel.costCenterId)
      ).leftJoin(
        countryModel,
        eq(assetModel.countryCode,countryModel.id)
      )
  if (!assetData.length) {
    throw BadRequestError("No asset categories found");
  }

  return assetData;
};
// Helper function to get cost center by ID
export const getAssetById = async (id: number) => {
  const ManufactureTable = alias(supplierModel, 'ManufacturerModel');

  const asset = await db.select({
    id: assetModel.id,
    assetCode: assetModel.assetCode,
    assetName: assetModel.assetName,
    startDate: assetModel.startDate,
    purDate: assetModel.purDate,
    categoryName: assetCategoryModel.category_name,
    user: assetModel.user,
    locationName: locationModel.name,
    sectionName: sectionModel.name,
    departmentName: deparmentModel.departmentName,
    // assetValue: assetModel.assetValue,
    // currentValue: assetModel.currentValue,
    // depRate: assetModel.depRate,
    // salvageValue: assetModel.salvageValue,
    status: assetModel.status,
    // soldDate: assetModel.soldDate,
    // soldValue: assetModel.soldDate,
    // manufacure: ManufactureTable.name,
    // mfgYear: assetModel.mfgYear,
    country: countryModel.name,
    model: assetModel.model,
    slNo: assetModel.slNo,
    costCenter: costCenterModel.costCenterName,
    assetGlCode: assetModel.assetGlCode,
    notes: assetModel.notes,
    createdBy: userModel.username,
    createdAt: assetModel.createdAt,
    // assetDepStartValue: assetModel.currentValue,
  }).from(assetModel)
    .leftJoin(assetCategoryModel, eq(assetModel.categoryId, assetCategoryModel.category_id))
    .leftJoin(deparmentModel, eq(assetModel.departmentId, deparmentModel.departmentID))
    .leftJoin(locationModel, eq(assetModel.locationId, locationModel.id))
    .leftJoin(sectionModel, eq(assetModel.sectionId, sectionModel.id))
    .leftJoin(costCenterModel, eq(assetModel.costCenterId, costCenterModel.costCenterId))
    .leftJoin(countryModel, eq(assetModel.countryCode, countryModel.id))
    .leftJoin(userModel, eq(assetModel.createdBy, userModel.userId))
    .where(eq(assetModel.id, id));

  if (!asset.length) {
    throw BadRequestError("Asset not found with the given ID");
  }

  return asset[0]; // Return single item
};


export const updateAsset = async (
  assetId: number,
  assetData: Partial<NewAsset>
) => {
  await db
    .update(assetModel)
    .set({
      categoryId: assetData.categoryId,
      locationId: assetData.locationId,
      departmentId: assetData.departmentId,
      user: assetData.user,
    })
    .where(eq(assetModel.id, assetId));

  const updatedAsset = await getAssetById(assetId);

  if (!updatedAsset) {
    throw new Error("Asset not found or update failed");
  }

  return updatedAsset;
};

export async function generateAssetCode(categoryCode: number, subCategoryCode: number): Promise<string> {
  // Get the total number of existing assets
  const [{ count: total }] = await db.select
  ({ count: count() }).from(assetModel).where
  (eq(assetModel.categoryId,subCategoryCode));

  // Serial number is next available number
  const serial = Number(total) + 1;
 console.log(serial)
  // Format each part with zero-padding
  const categoryStr = String(categoryCode).padStart(2, "0");
  const subCategoryStr = String(subCategoryCode).padStart(4, "0");
  const serialStr = String(serial).padStart(3, "0");

  return `${categoryStr} ${subCategoryStr} ${serialStr}`;
}
