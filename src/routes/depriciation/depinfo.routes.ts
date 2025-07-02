import { Router } from "express";
import { authenticateUser } from "../../middlewares/auth.middleware";


import { createDepriciationInfoController, editDepriciationInfoController, getAllDepriciationInfosController, getDepriciationInfobyAssetController, getDepriciationInfoController } from "../../controllers/depreciation/depInfo.controller";


const router = Router();

router.post("/create",authenticateUser, createDepriciationInfoController);
router.get("/getall",authenticateUser, getAllDepriciationInfosController);
router.get("/get/:id",authenticateUser, getDepriciationInfoController);
router.get("/getbyAsset/:id",authenticateUser,getDepriciationInfobyAssetController)
router.patch("/edit/:id",authenticateUser, editDepriciationInfoController);
export default router;
