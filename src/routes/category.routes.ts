import { Router } from "express";

import { authenticateUser } from "../middlewares/auth.middleware";
import { createCategoryController, editCategoryController, getAllCategoryController } from "../controllers/assetcategory.controller";


const router = Router();

router.post("/create",authenticateUser, createCategoryController);
router.get("/getall",authenticateUser, getAllCategoryController);
router.patch("/edit/:id",authenticateUser, editCategoryController);
export default router;
