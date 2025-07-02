import { Router } from "express";
import { authenticateUser } from "../middlewares/auth.middleware";
import { createAssetController, editAssetController, getAllAssetController, getAssetByIdController, getNextAssetCodeController } from "../controllers/asset.controller";

const router = Router();

router.post("/create",authenticateUser, createAssetController);
router.get("/getall",authenticateUser, getAllAssetController);
router.get('/getDetails/:id', authenticateUser, getAssetByIdController);
router.patch("/edit/:id",authenticateUser, editAssetController);
router.get('/getNextCode/:catId/:subCatId',getNextAssetCodeController);
export default router;
