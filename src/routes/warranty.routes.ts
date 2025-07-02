import { Router } from "express";
import { authenticateUser } from "../middlewares/auth.middleware";
import { createWarrantyController, editWarrantyController, getAllWarrantyController, getWarrantyByAssetIdController, getWarrantyByIdController } from "../controllers/warranty.controller";

const router = Router();

router.post("/create",authenticateUser, createWarrantyController);
router.get("/getall",authenticateUser, getAllWarrantyController);
router.get('/getDetails/:id', authenticateUser, getWarrantyByIdController);
router.get('/getWarranty/:assetId', authenticateUser, getWarrantyByAssetIdController);
router.patch("/edit/:id",authenticateUser, editWarrantyController);

export default router;
