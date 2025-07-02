import express from "express"
import { getAllDepreciationController, getDepreciationByAssetIdController, getDepreciationByPeriodAndBookIdController, getPeriodController, handleCompanyDepreciation } from "../../controllers/depreciation/depreciationCalculation.controller"
import { authenticateUser } from "../../middlewares/auth.middleware"

const router = express.Router()

// POST /api/depreciation/calculate
router.post("/calculate", handleCompanyDepreciation)
router.get("/getAllDepreciation", getAllDepreciationController)
router.get("/getDepByAssetId/:assetId", getDepreciationByAssetIdController)
router.get("/getDepByPeriodAndBook/:period/:bookId",authenticateUser, getDepreciationByPeriodAndBookIdController)
router.get("/getPeriod",getPeriodController)
export default router
