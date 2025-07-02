import { NextFunction,Request,Response } from "express";
import { requirePermission } from "../services/utils/jwt.utils";
import { z } from "zod";
import { assetInfoReport, catWiseDepReport, catWiseMonthlyDepReport, costCenterRept, monthlyDepreciationInfoReport } from "../services/reports.service";

const catWiseDepReportSchema = z.object({
  companyId: z.coerce.number().int().positive(),
  bookId: z.coerce.number().int().positive(),
  period: z.string().min(1).max(10),
});

export const getCatWiseDepReportController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    requirePermission(req, 'view_report');
    const paramData = catWiseDepReportSchema.parse(req.query);
    const data = await catWiseDepReport(paramData);

    res.status(201).json(data);
  } catch (error) {
    next(error);
  }
};


const catWiseMonthlyDepReportSchema = z.object({
  companyId: z.coerce.number().int().positive(),
  bookId: z.coerce.number().int().positive(),
  period: z.string().min(1).max(10),
});

export const getCatWiseMonthlyDepReportController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    requirePermission(req, 'view_report');
    const paramData = catWiseMonthlyDepReportSchema.parse(req.query);
    const data = await catWiseMonthlyDepReport(paramData);

    res.status(201).json(data);
  } catch (error) {
    next(error);
  }
};


const reportcostCenterSchema = z.object({
  companyId: z.coerce.number().int().positive(),
  bookId: z.coerce.number().int().positive(),
  period: z.string().min(1).max(10),
});
export const getCostCenterReportController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    requirePermission(req, 'view_report'); 
    const paramData = reportcostCenterSchema.parse(req.query);
    const data = await costCenterRept(paramData);

    res.status(201).json(data);
  } catch (error) {
    next(error);
  }
};

const assetInfoReportSchema = z.object({
  companyId: z.coerce.number().int().positive(),
});

export const getAssetInfoReportController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    requirePermission(req, 'view_asset_info_report');
    const paramData = assetInfoReportSchema.parse(req.query);
    const data = await assetInfoReport(paramData);

    res.status(201).json(data);
  } catch (error) {
    next(error);
  }
};

const monthlyDepreciationInfoReportSchema = z.object({
  companyId: z.coerce.number().int().positive(),
  bookId: z.coerce.number().int().positive(),
  period: z.string().min(1).max(10),
});
export const getMonthlyDepreciationInfoReportController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    requirePermission(req, 'view_report');
    const paramData = monthlyDepreciationInfoReportSchema.parse(req.query);
    const data = await monthlyDepreciationInfoReport(paramData);

    res.status(201).json(data);
  } catch (error) {
    next(error);
  }
};
