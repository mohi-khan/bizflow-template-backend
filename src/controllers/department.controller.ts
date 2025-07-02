import { NextFunction, Request, Response } from "express";
import { z } from "zod";
import {
  createDepartment,
  editDepartment,
  getAllDepartments,
  getDepartmentById,
} from "../services/department.service";
import { createInsertSchema } from "drizzle-zod";
import { deparmentModel } from "../schemas";
import { requirePermission } from "../services/utils/jwt.utils";

const dateStringToDate = z.preprocess(
  (arg) => (typeof arg === "string" || arg instanceof Date ? new Date(arg) : undefined),
  z.date()
);

// Apply the preprocessing to your schema
const baseSchema = createInsertSchema(deparmentModel).extend({
  startDate: dateStringToDate,
  endDate: dateStringToDate,
});

const createDepartmentSchema = baseSchema;

const editDepartmentSchema = createDepartmentSchema.omit({
  departmentID: true,
  startDate: true,
  companyCode:true,
  endDate:true,
  createdAt: true,
  createdBy: true,
}) .extend({
  departmentName: createDepartmentSchema.shape.departmentName.optional(),
});

export const createDepartmentController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    requirePermission(req, 'create_department'); 
    const departmentData = createDepartmentSchema.parse(req.body);
    console.log("🚀 ~ departmentData:", departmentData)
    const department = await createDepartment(departmentData);

    res.status(201).json({
      status: "success",
      data: {
        department,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getAllDepartmentsController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    requirePermission(req, 'view_department');
    const departments = await getAllDepartments();
    console.log(departments);

    res.status(200).json(departments);
  } catch (error) {
    next(error);
  }
};

export const getDepartmentController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    requirePermission(req, 'view department'); 
    const id: number = Number(req.params.id);
    const departments = await getDepartmentById(id);
    console.log(departments);

    res.status(200).json(departments);
  } catch (error) {
    next(error);
  }
};
export const editDepartmentController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    requirePermission(req, 'edit department'); 
    const id: number = Number(req.params.id);
    const departmentData = editDepartmentSchema.parse(req.body);
    const department = await editDepartment(id, departmentData);
   
    

    res.status(200).json(department);
  } catch (error) {
    next(error);
  }
};