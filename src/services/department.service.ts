import { eq } from "drizzle-orm";
import { db } from "../config/database";
import { deparmentModel, NewDepartment } from "../schemas";
import { BadRequestError } from "./utils/errors.utils";

//Helper function to create Department Data

export const createDepartment = async (
  departmentData: Omit<NewDepartment, "departmentID">
) => {
  try {
    const [newDepartment] = await db.insert(deparmentModel).values({
      ...departmentData,
      createdAt: new Date(),
    });

    return newDepartment;
  } catch (error) {
    throw error;
  }
};
//Helper funciton for Get All Departments
export const getAllDepartments = async () => {
  const departments = await db.select().from(deparmentModel);
  return departments;
};

// Helper function to get department by ID
export const getDepartmentById = async (departmentId: number) => {
    const department = await db
        .select()
        .from(deparmentModel)
        .where(eq(deparmentModel.departmentID, departmentId))
        .limit(1);

    if (!department.length) {
        throw BadRequestError("Department not found");
    }

    return department[0];
};
//Helper funciton for Update Department


export const editDepartment = async (
    departmentId: number,
    departmentData: Partial<NewDepartment>
) => {
    const [updatedDepartment] = await db
        .update(deparmentModel)
        .set({
            ...departmentData,
         
        })
        .where(eq(deparmentModel.departmentID, departmentId))

    return updatedDepartment;
};