import { Router } from "express";

import { authenticateUser } from "../middlewares/auth.middleware";

import { createSupplierController, editSupplierController, getAllSupplierController, getSupplierControllerById } from "../controllers/supplier.controller";

const router = Router();

router.post("/create",authenticateUser, createSupplierController);
router.get("/getall",authenticateUser, getAllSupplierController);
router.get("/get/:id",authenticateUser, getSupplierControllerById);
router.patch("/edit/:id",authenticateUser, editSupplierController);
export default router;
