import { Router } from "express";
import { authenticateUser } from "../middlewares/auth.middleware";
import { createMaintenanceController, editmaintenanceController, getAllmaintenanceController, getMaintenanceByAssetIdController, getmaintenanceByIdController } from "../controllers/maintenance.controller";


const router = Router();

router.post("/create",authenticateUser, createMaintenanceController);
router.get("/getall",authenticateUser, getAllmaintenanceController);
router.get('/getDetails/:id', authenticateUser, getmaintenanceByIdController);
router.get('/getMaintenance/:assetId', authenticateUser, getMaintenanceByAssetIdController);
router.patch("/edit/:id",authenticateUser, editmaintenanceController);

export default router;
