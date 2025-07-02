import { eq } from "drizzle-orm";


import { alias } from "drizzle-orm/mysql-core";
import { assetCategoryModel, NewCategory } from "../schemas";
import { db } from "../config/database";
import { BadRequestError } from "./utils/errors.utils";

export const createAssetCategory = async (assetCategoryData: NewCategory) => {
  try {
    const [newAssetCategory] = await db
      .insert(assetCategoryModel)
      .values(assetCategoryData)
      .execute();
    console.log('asset category from backend', assetCategoryData);
    return newAssetCategory;
  } catch (error) {
    throw error;
  }
};

export const getAllAssetCategories = async () => {
  // Create aliases for the chart of accounts table
 
  const subCategoryTable = alias(assetCategoryModel,'sub_category');

  const assetCategories = await db.select({
    category_id: assetCategoryModel.category_id,
    category_name: assetCategoryModel.category_name,
    account_code: assetCategoryModel.account_code,
    depreciation_account_code: assetCategoryModel.depreciation_account_code,
    depreciation_rate: assetCategoryModel.depreciation_rate,
    parent_cat_code: assetCategoryModel.parent_cat_code,
    createdBy: assetCategoryModel.created_by,
  }).from(assetCategoryModel)
    .leftJoin(
      subCategoryTable, 
      eq(assetCategoryModel.parent_cat_code, subCategoryTable.category_id)
    )
  

  if (!assetCategories.length) {
    throw BadRequestError("No asset categories found");
  }

  return assetCategories;
};

export const updateAssetCategory = async (
  category_id: number,
  assetCategoryData: Partial<NewCategory>
) => {
  const [updatedAssetCategory] = await db
    .update(assetCategoryModel)
    .set(assetCategoryData)
    .where(eq(assetCategoryModel.category_id, category_id))
    .execute();

  if (!updatedAssetCategory) {
    throw new Error("Asset category not found or update failed");
  }

  return updatedAssetCategory;
};