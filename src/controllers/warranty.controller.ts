
import { z } from "zod";
import { NextFunction, Request, Response } from "express";
import { createInsertSchema } from "drizzle-zod";
import { warrantyModel} from "../schemas";
import { requirePermission } from "../services/utils/jwt.utils";
import { createWarranty, editWarranty, getAllWarranty, getWarrantyByAssetId, getWarrantyById } from "../services/warranty.service";
import { BadRequestError } from "../services/utils/errors.utils";

const dateStringToDate = z.preprocess(
  (arg) => (typeof arg === "string" || arg instanceof Date ? new Date(arg) : undefined),
  z.date()
);

const createWarrantySchema = createInsertSchema(warrantyModel).extend({
  start_date: dateStringToDate,
  end_date: dateStringToDate,
})
const editWarrantySchema = createWarrantySchema.omit({
    id: true,

  }) .extend({
    start_date: createWarrantySchema.shape.start_date.optional(),
    end_date:createWarrantySchema.shape.end_date.optional(),
    description:createWarrantySchema.shape.description.optional(),
    warranty_provider:createWarrantySchema.shape.warranty_provider.optional(),
  });



// create Warranty
export const createWarrantyController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    requirePermission(req, 'create_warranty');


    const warrantyData = createWarrantySchema.parse(req.body);
    const warranty = await createWarranty(warrantyData);

    res.status(201).json({
      status: "success",
      data: {
        warranty,
      },
    });
  } catch (error) {
    next(error);
  }
};

//get all warratny
export const getAllWarrantyController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    requirePermission(req, 'view_asset');
    const warrantys = await getAllWarranty();
    res.json(warrantys);
  } catch (error) {
    next(error);
  }
};

export const getWarrantyByIdController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    requirePermission(req, 'view_asset');
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
      throw BadRequestError("Invalid ID");
    }

    const warranty = await getWarrantyById(id);
    res.json(warranty);
  } catch (error) {
    next(error);
  }
};

export const getWarrantyByAssetIdController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    requirePermission(req, 'view_asset');
    const assetId = parseInt(req.params.assetId);

    if (isNaN(assetId)) {
      throw BadRequestError("Invalid Asset ID");
    }

    const warranty = await getWarrantyByAssetId(assetId);
    res.json(warranty);
  } catch (error) {
    next(error);
  }
};



// edit warranty
export const editWarrantyController = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        requirePermission(req, 'edit_warranty');        
        const warrantyId: number = Number(req.params.id);
        const warrantyData = editWarrantySchema.parse(req.body);
        const updatedWarratny = await editWarranty(warrantyId, warrantyData);

        res.json({
            status: "success",
            data: {
                updatedWarratny,
            },
        });
    } catch (error) {
        next(error);
    }
};
