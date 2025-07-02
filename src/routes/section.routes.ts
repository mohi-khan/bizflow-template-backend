import { Router } from "express";

import { authenticateUser } from "../middlewares/auth.middleware";
import { createSectionController, editSectionController, getAllSectionsController, getSectionController } from "../controllers/section.controller";




const router = Router();

router.post("/create",authenticateUser, createSectionController);
router.get("/getall",authenticateUser, getAllSectionsController);
router.get("/get/:id",authenticateUser, getSectionController);
router.patch("/edit/:id",authenticateUser, editSectionController);
export default router;
