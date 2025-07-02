// costCenter.controller.ts
import { NextFunction, Request, Response } from "express";
import { number, z } from "zod";
import { createCostCenter, editCostCenter, activateCostCenter, deactivateCostCenter, deleteCostCenter, getAllCostCenters } from "../services/cost-centers.service";
import { createInsertSchema } from "drizzle-zod";
import { costCenterModel } from "../schemas";
import { requirePermission } from "../services/utils/jwt.utils";

const dateStringToDate = z.preprocess(
    (arg) => (typeof arg === "string" || arg instanceof Date ? new Date(arg) : undefined),
    z.date()
  );

const costCenterSchema = createInsertSchema(costCenterModel).extend({
    startDate: dateStringToDate,
    endDate: dateStringToDate,
    createdAt: dateStringToDate,
  });
const editCostCenterSchema = costCenterSchema.omit({
    costCenterId: true,
    startDate: true,
    companyCode:true,
    endDate:true,
    createdAt: true,
    updatedAt: true,
    createdBy: true,
  }) .extend({
    createdAt: dateStringToDate,
    costCenterName: costCenterSchema.shape.costCenterName.optional(),
  });


// create cost center
export const createCostCenterController = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        requirePermission(req, 'create_costCenter');        
        const costCenterData = costCenterSchema.parse(req.body);
        const costCenter = await createCostCenter(costCenterData);

        res.status(201).json({
            status: "success",
            data: {
                costCenter,
            },
        });
    } catch (error) {
        next(error);
    }
};

export const getAllCostCentersController = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        requirePermission(req, 'view_costCenter');        
        const costCenters = await getAllCostCenters();

        res.status(200).json( costCenters,
        );
    } catch (error) {
        next(error);
    }
};

// edit cost center
export const editCostCenterController = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        requirePermission(req, 'edit_costCenter');        
        const costCenterId: number = Number(req.params.id);
        const costCenterData = editCostCenterSchema.parse(req.body);
        const costCenter = await editCostCenter(costCenterId, costCenterData);

        res.json({
            status: "success",
            data: {
                costCenter,
            },
        });
    } catch (error) {
        next(error);
    }
};

// activate cost center
export const activateCostCenterController = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        requirePermission(req, 'edit_costCenter');        
        const costCenterId: number = Number(req.params.id);
        const costCenter = await activateCostCenter(costCenterId);

        res.json({
            status: "success",
            data: {
                costCenter,
            },
        });
    } catch (error) {
        next(error);
    }
};

// deactivate cost center
export const deactivateCostCenterController = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        requirePermission(req, 'edit_costCenter');        
        const costCenterId: number = Number(req.params.id);
        const costCenter = await deactivateCostCenter(costCenterId);

        res.json({
            status: "success",
            data: {
                costCenter,
            },
        });
    } catch (error) {
        next(error);
    }
};

// delete cost center
export const deleteCostCenterController = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        requirePermission(req, 'delete_costCenter');        
        const costCenterId: number = Number(req.params.id);
        await deleteCostCenter(costCenterId);

        res.status(204).send();
    } catch (error) {
        next(error);
    }
};