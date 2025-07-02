import { z } from "zod";
import { NextFunction, Request, Response } from "express";
import { createInsertSchema } from "drizzle-zod";
import { assetModel } from "../schemas";
import { requirePermission } from "../services/utils/jwt.utils";
import {
  createAsset,
  generateAssetCode,
  getAllAsset,
  getAssetById,
  updateAsset,
} from "../services/asset.service";
import { BadRequestError } from "../services/utils/errors.utils";
import { error } from "console";

const dateStringToDate = z.preprocess(
  (arg) =>
    typeof arg === "string" || arg instanceof Date ? new Date(arg) : undefined,
  z.date()
);

const createAssetSchema = createInsertSchema(assetModel).extend({
  startDate: dateStringToDate,
  purDate: dateStringToDate,
});

const editAssetSchema = z.object({
  locationId: createAssetSchema.shape.locationId.optional(),
  categoryId: createAssetSchema.shape.categoryId.optional(),
  departmentId: createAssetSchema.shape.departmentId.optional(),
  user: createAssetSchema.shape.user.optional(),
});


// create company
export const createAssetController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    requirePermission(req, "create_asset");

    const assetData = createAssetSchema.parse(req.body);
    const company = await createAsset(assetData);

    res.status(201).json({
      status: "success",
      data: {
        company,
      },
    });
  } catch (error) {
    next(error);
  }
};

//get all categoryies
export const getAllAssetController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    requirePermission(req, "view_asset");
    const assets = await getAllAsset();
    res.json(assets);
  } catch (error) {
    next(error);
  }
};

export const getAssetByIdController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    requirePermission(req, "view_asset_details");
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
      throw BadRequestError("Invalid ID");
    }

    const asset = await getAssetById(id);
    res.json(asset);
  } catch (error) {
    next(error);
  }
};

// edit asset
export const editAssetController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // requirePermission(req, 'edit_asset');
    const assetId: number = Number(req.params.id);
    const assetData = editAssetSchema.parse(req.body);
    const category = await updateAsset(assetId, assetData);

    res.json({
      status: "success",
      data: {
        category,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getNextAssetCodeController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // requirePermission(req, 'create_asset');
    console.log("withing asset");
    const categoryId: number = Number(req.params.catId);
    const subcategoryId: number = Number(req.params.subCatId);
    console.log(categoryId);
    const category = await generateAssetCode(categoryId, subcategoryId);

    res.json({
      status: "success",
      data: {
        category,
      },
    });
  } catch (Error) {
    next(error);
  }
};
