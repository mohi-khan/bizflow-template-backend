// company.controller.ts
import { NextFunction, Request, Response } from "express";
import { z } from "zod";
import { createInsertSchema } from "drizzle-zod";
import { assetCategoryModel } from "../schemas";
import { requirePermission } from "../services/utils/jwt.utils";
import { createAssetCategory, getAllAssetCategories, updateAssetCategory } from "../services/assetCategory.service";

const dateStringToDate = z.preprocess(
  (arg) => (typeof arg === "string" || arg instanceof Date ? new Date(arg) : undefined),
  z.date()
);

const createCategorySchema = createInsertSchema(assetCategoryModel).extend({
  created_time: dateStringToDate
});
const editCategorySchema = createCategorySchema.omit({
    category_id: true,
    depreciation_rate: true,
    created_time: true,
    created_by: true,
  }) .extend({
    costCenterName: createCategorySchema.shape.category_name.optional()
  });



// create company
export const createCategoryController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    requirePermission(req, 'create_category');


    const categoryData = createCategorySchema.parse(req.body);
    const company = await createAssetCategory(categoryData);

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
export const getAllCategoryController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    requirePermission(req, 'view_category');
    const categories = await getAllAssetCategories();
    res.json(categories);
  } catch (error) {
    next(error);
  }
};

// edit category
export const editCategoryController = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        requirePermission(req, 'edit_category');        
        const categoryId: number = Number(req.params.id);
        const categoryData = editCategorySchema.parse(req.body);
        const category = await updateAssetCategory(categoryId, categoryData);

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
