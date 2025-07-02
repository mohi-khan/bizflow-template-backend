import { Router } from "express";
import { createDepartmentController, editDepartmentController, getAllDepartmentsController, getDepartmentController } from "../controllers/department.controller";
import { authenticateUser } from "../middlewares/auth.middleware";

const router = Router();

router.post("/create",authenticateUser, createDepartmentController);
router.get("/getall",authenticateUser, getAllDepartmentsController);
router.get("/get/:id",authenticateUser, getDepartmentController);
router.patch("/edit/:id",authenticateUser, editDepartmentController);
export default router;
