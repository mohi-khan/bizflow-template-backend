
import { z } from "zod";
import { NextFunction, Request, Response } from "express";
import { createInsertSchema } from "drizzle-zod";
import { maintenanceModel} from "../schemas";
import { requirePermission } from "../services/utils/jwt.utils";
import { BadRequestError } from "../services/utils/errors.utils";
import { createMaintainance, editMaintainance, getAllMaintainance, getMaintainanceByAssetId, getMaintainanceById } from "../services/maintainence.service";

const dateStringToDate = z.preprocess(
  (arg) => (typeof arg === "string" || arg instanceof Date ? new Date(arg) : undefined),
  z.date()
);

const createMaintenanceSchema = createInsertSchema(maintenanceModel).extend({
  maintDate: dateStringToDate,
})
const editmaintenanceSchema = createMaintenanceSchema.omit({
    id: true,

  }) .extend({
    cost: createMaintenanceSchema.shape.cost.optional(),
    maintDate:createMaintenanceSchema.shape.maintDate.optional(),
    description:createMaintenanceSchema.shape.description.optional(),
    performedBy:createMaintenanceSchema.shape.performedBy.optional(),
    type:createMaintenanceSchema.shape.type.optional(),
  });



// create maintenance
export const createMaintenanceController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    requirePermission(req, 'create_maintenance');


    const maintenanceData = createMaintenanceSchema.parse(req.body);
    const maintenance = await createMaintainance(maintenanceData);

    res.status(201).json({
      status: "success",
      data: {
        maintenance,
      },
    });
  } catch (error) {
    next(error);
  }
};

//get all warratny
export const getAllmaintenanceController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    requirePermission(req, 'view_asset');
    const maintenances = await getAllMaintainance();
    res.json(maintenances);
  } catch (error) {
    next(error);
  }
};

export const getmaintenanceByIdController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    requirePermission(req, 'view_asset');
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
      throw BadRequestError("Invalid ID");
    }

    const maintenance = await getMaintainanceById(id);
    res.json(maintenance);
  } catch (error) {
    next(error);
  }
};

export const getMaintenanceByAssetIdController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    requirePermission(req, 'view_asset');
    const assetId = parseInt(req.params.assetId);

    if (isNaN(assetId)) {
      throw BadRequestError("Invalid Asset ID");
    }

    const maintenance = await getMaintainanceByAssetId(assetId);
    res.json(maintenance);
  } catch (error) {
    next(error);
  }
};



// edit maintenance
export const editmaintenanceController = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        requirePermission(req, 'edit_maintenance');        
        const maintenanceId: number = Number(req.params.id);
        const maintenanceData = editmaintenanceSchema.parse(req.body);
        const updatedWarratny = await editMaintainance(maintenanceId, maintenanceData);

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
