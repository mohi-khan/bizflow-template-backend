import { NextFunction, Request, Response } from "express"
import { calculateCompanyDepreciation, getAllDepreciation, getAllDepreciationByAssetId, getDepreciationByPeriodAndBookId } from "../../services/depreciation/depreciaitionCalculation.service"
import { z } from "zod"
import { parseDateFields } from "../../services/utils/common.utils"
import { requirePermission } from "../../services/utils/jwt.utils"
import { getDistinctPeriod } from "../../services/depreciation/depreciationTransaction.service"

const DepreciationSchema = z.object({
  company_id: z.number(),
  depreciation_date: z.date(), // or z.string() if ISO string
  book_id: z.number(),
  saveToDatabase: z.boolean().optional().default(false)
})

export const handleCompanyDepreciation = async (req: Request, res: Response) => {
  try {
    const processedReq=parseDateFields(req.body,["depreciation_date"])
  
    const { company_id, depreciation_date, book_id, saveToDatabase } = DepreciationSchema.parse(processedReq)



    const depreciationResults = await calculateCompanyDepreciation({
      company_id,
      depreciation_date: new Date(depreciation_date),
      book_id,
      saveToDatabase,
    })

    res.status(200).json(depreciationResults)
      
  } catch (error) {
    console.error("Depreciation Error:", error)
    res.status(500).json({ message: "Internal server error.", error })
  }
}

export const getAllDepreciationController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
   // requirePermission(req, 'view_all_depreciation');
    const depreciation = await getAllDepreciation();
    
    res.status(200).json(depreciation);
  } catch (error) {
    next(error);
  }
};


export const getDepreciationByAssetIdController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
  //  requirePermission(req, 'view_asset');
    const { assetId } = req.params;
    const depreciation = await getAllDepreciationByAssetId(Number(assetId));
    console.log(depreciation);
    
    res.status(200).json(depreciation);
  } catch (error) {
    next(error);
  }
};

export const getDepreciationByPeriodAndBookIdController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
  //  requirePermission(req, 'view_depreciation');
    const { period, bookId } = req.params;
    const depreciation = await getDepreciationByPeriodAndBookId(period, Number(bookId));
    
    res.status(200).json(depreciation);
  } catch (error) {
    next(error);
  }
};

export const getPeriodController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
   

    const period = await getDistinctPeriod();
    
    res.status(200).json(period);
  } catch (error) {
    next(error);
  }
};