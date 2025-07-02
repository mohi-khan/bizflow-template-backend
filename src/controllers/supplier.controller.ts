// company.controller.ts
import { NextFunction, Request, Response } from "express";
import { z } from "zod";

import { createInsertSchema } from "drizzle-zod";

import { requirePermission } from "../services/utils/jwt.utils";
import { supplierModel } from "../schemas";
import { createSupplier, getAllSuppliers, getSupplierById, updateSupplier } from "../services/supplier.service";

const dateStringToDate = z.preprocess(
  (arg) => (typeof arg === "string" || arg instanceof Date ? new Date(arg) : undefined),
  z.date()
);

const createSupplierSchema = createInsertSchema(supplierModel).extend({
  createdAt: dateStringToDate,
});
const editSupplierSchema = createSupplierSchema.omit({
    id: true,
    createdAt: true,
    updatedAt: true,
    createdBy: true,
    
  }) .extend({
    name: createSupplierSchema.shape.name.optional(),
    type: createSupplierSchema.shape.type.optional(),
    mobile: createSupplierSchema.shape.mobile.optional(),
    city: createSupplierSchema.shape.city.optional(),
  });
  


// create supplier
export const createSupplierController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    requirePermission(req, 'create_supplier');
    const supplierdata = req.body
  
    const supplierData = createSupplierSchema.parse(supplierdata);
    const supplier = await createSupplier(supplierData);

    res.status(201).json({
      status: "success",
      data: {
        supplier,
      },
    });
  } catch (error) {
    next(error);
  }
};



//get supplier details by id  
export const getSupplierControllerById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    requirePermission(req, 'view_supplier');
    const supplierId = parseInt(req.params.id, 10);
    const supplier = await getSupplierById(supplierId);
    res.json(supplier);
  } catch (error) {
    throw error;
  }

};


//get all Suppliers
export const getAllSupplierController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    requirePermission(req, 'view_supplier');
    const suppliers = await getAllSuppliers();
    res.json(suppliers);
  } catch (error) {
    next(error);
  }
};

export const editSupplierController = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        requirePermission(req, 'edit_supplier');        
        const supplierId: number = Number(req.params.id);
        const supplierData = editSupplierSchema.parse(req.body);
        const supplier = await updateSupplier(supplierId, supplierData);

        res.json({
            status: "success",
            data: {
                supplier,
            },
        });
    } catch (error) {
        next(error);
    }
};