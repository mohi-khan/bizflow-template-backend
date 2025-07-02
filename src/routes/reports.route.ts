import { Router } from "express";
import { authenticateUser } from "../middlewares/auth.middleware";
import { getAssetInfoReportController, getCatWiseDepReportController, getCatWiseMonthlyDepReportController, getCostCenterReportController, getMonthlyDepreciationInfoReportController } from "../controllers/reports.controller";

const router = Router();


router.get("/getCostCenterReport",authenticateUser, getCostCenterReportController);
router.get("/getAssetInfoReport",authenticateUser, getAssetInfoReportController);
router.get("/getCatWiseDepReport",authenticateUser, getCatWiseDepReportController);
router.get("/getCatWiseMonthlyDepReport",authenticateUser, getCatWiseMonthlyDepReportController);
router.get("/getMonthlyDepInfoReport",authenticateUser, getMonthlyDepreciationInfoReportController);

export default router;