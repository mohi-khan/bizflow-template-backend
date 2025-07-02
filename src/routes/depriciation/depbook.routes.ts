import { Router } from "express";
import { authenticateUser } from "../../middlewares/auth.middleware";

import { createDepreiciaitonBookController, editDepreiciaitonBookController, getAllDepreiciaitonBooksController, getDepreiciaitonBookController } from "../../controllers/depreciation/depbook.controller";


const router = Router();

router.post("/create",authenticateUser, createDepreiciaitonBookController);
router.get("/getall",authenticateUser, getAllDepreiciaitonBooksController);
router.get("/get/:id",authenticateUser, getDepreiciaitonBookController);
router.patch("/edit/:id",authenticateUser, editDepreiciaitonBookController);
export default router;
