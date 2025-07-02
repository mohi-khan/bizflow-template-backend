import { Router } from "express";

import { authenticateUser } from "../middlewares/auth.middleware";

import { createLocationController, editLocationController, getAllLocationsController, getLocationController } from "../controllers/locaion.controller";


const router = Router();

router.post("/create",authenticateUser, createLocationController);
router.get("/getall",authenticateUser, getAllLocationsController);
router.get("/get/:id",authenticateUser, getLocationController);
router.patch("/edit/:id",authenticateUser, editLocationController);
export default router;
