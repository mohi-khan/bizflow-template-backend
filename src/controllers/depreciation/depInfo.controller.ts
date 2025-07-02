import { NextFunction, Request, Response } from "express";
import { z } from "zod";

import { createInsertSchema } from "drizzle-zod";
import { depreciationInfoModel } from "../../schemas";
import { requirePermission } from "../../services/utils/jwt.utils";
import { createDepInfo, editDepInfo, getAllDepInfos, getAllDepInfosbyAssetId, getDepInfoById } from "../../services/depreciation/depreciationInfo.service";
import { getDepInfoByAssetId } from "../../services/depreciation/depreciationTransaction.service";



const dateStringToDate = z.preprocess(
  (arg) => (typeof arg === "string" || arg instanceof Date ? new Date(arg) : undefined),
  z.date()
);

// Apply the preprocessing to your schema
const baseSchema = createInsertSchema(depreciationInfoModel).extend({
  effectiveDate: dateStringToDate
});

const createDepriciationInfoSchema = baseSchema;

const editDepriciationInfoSchema = createDepriciationInfoSchema.omit({
  id: true,
  assetId:true,
  bookId:true,
  createdAt: true,
  createdBy: true,
}) .extend({
  depreciationMethod: createDepriciationInfoSchema.shape.depreciationMethod.optional(),
  depreciationRate: createDepriciationInfoSchema.shape.depreciationRate.optional(),
  effectiveDate: createDepriciationInfoSchema.shape.effectiveDate.optional(),
  residualValue: createDepriciationInfoSchema.shape.residualValue.optional(),
  startingValue: createDepriciationInfoSchema.shape.startingValue.optional(),
  usefulLifeMonths: createDepriciationInfoSchema.shape.usefulLifeMonths.optional(),
});


export const createDepriciationInfoController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    requirePermission(req, 'create_dep_info'); 
    const depriciationInfoData = createDepriciationInfoSchema.parse(req.body);
    console.log("🚀 ~ depriciationInfoData:", depriciationInfoData)
    const depriciationInfo = await createDepInfo(depriciationInfoData);

    res.status(201).json({
      status: "success",
      data: {
        depriciationInfo,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getAllDepriciationInfosController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    requirePermission(req, 'view depriciaiton');
    const depriciationInfos = await getAllDepInfos();
    console.log(depriciationInfos);

    res.status(200).json(depriciationInfos);
  } catch (error) {
    next(error);
  }
};

export const getDepriciationInfoController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    requirePermission(req, 'view depriciaiton'); 
    const id: number = Number(req.params.id);
    const depriciationInfos = await getDepInfoById(id);
    console.log(depriciationInfos);

    res.status(200).json(depriciationInfos);
  } catch (error) {
    next(error);
  }
};
export const getDepriciationInfobyAssetController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
  //  requirePermission(req, 'view depriciaiton'); 
    const id: number = Number(req.params.id);
    const depriciationInfos = await getAllDepInfosbyAssetId(id);
    console.log(depriciationInfos);

    res.status(200).json(depriciationInfos);
  } catch (error) {
    next(error);
  }
};
export const editDepriciationInfoController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    requirePermission(req, 'edit depriciaiton'); 
    const id: number = Number(req.params.id);
    const depriciationInfoData = editDepriciationInfoSchema.parse(req.body);
    const depriciationInfo = await editDepInfo(id, depriciationInfoData);
   
    

    res.status(200).json(depriciationInfo);
  } catch (error) {
    next(error);
  }
};