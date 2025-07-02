import { eq } from "drizzle-orm";
import { db } from "../config/database";
import {   NewSupplier, supplierModel } from "../schemas";
import { BadRequestError } from "./utils/errors.utils";

export const createSupplier = async (
    supplierData: NewSupplier
  ) => {
    try {
      const [newSupplier] = await db
        .insert(supplierModel)
        .values(supplierData)
        .$returningId();
      
      return newSupplier;
    } catch (error) {
      throw error;
    }
  };
  
  // Get company by ID
  export const getSupplierById = async (suplierId: number) => {
    const supplier = await db
      .select()
      .from(supplierModel)
      .where(eq(supplierModel.id, suplierId))
      .limit(1);
 
  
    if (!supplier.length) {
      throw BadRequestError("Company not found");
    }
  
    return supplier[0];
  };
  
  // get company by all
  
  export const getAllSuppliers = async () => {
    const suppliers = await db.select().from(supplierModel);
  
    // console.log(companies);
  
    if (!suppliers.length) {
      throw BadRequestError("No suppliers found");
    }
  
    return suppliers;
  };
  
  // Update company
  export const updateSupplier = async (
    supplierId: number,
    supplierData: Partial<NewSupplier>
  ) => {
    const existingSupplier = await getSupplierById(supplierId);
  
    if (
      supplierData.name &&
      supplierData.name !== existingSupplier.name
    ) {
      const nameExists = await db
        .select()
        .from(supplierModel)
        .where(eq(supplierModel.name, supplierData.name))
        .limit(1);
  
      if (nameExists.length > 0) {
        throw BadRequestError("Supplier name already exists");
      }
    }
  
    const [updatedSupplier] = await db
      .update(supplierModel)
      .set(supplierData)
      .where(eq(supplierModel.id, supplierId));
  
    return updatedSupplier;
  };
  
  
  