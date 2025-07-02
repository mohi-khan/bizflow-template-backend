import { Router } from "express";
import {
  createAssetRetirementController,
  getAllAssetRetirementController,
  getAssetRetirementByIdController,
  editAssetRetirementController,
} from "../controllers/assetRetirement.controller";

const router = Router();

router.post("/create", createAssetRetirementController);
router.get("/getall", getAllAssetRetirementController);
router.get("/getById/:id", getAssetRetirementByIdController);
router.put("/edit/:id", editAssetRetirementController);

export default router;
