import { NextFunction, Request, Response } from "express";
import { z } from "zod";

import { createInsertSchema } from "drizzle-zod";

import { requirePermission } from "../../services/utils/jwt.utils";

import { depreciationBookModel } from "../../schemas";
import { createDepBook, editDepBook, getAllDepBooks, getDepBookById } from "../../services/depreciation/depreciationBook.service";



const dateStringToDate = z.preprocess(
  (arg) => (typeof arg === "string" || arg instanceof Date ? new Date(arg) : undefined),
  z.date()
);

// Apply the preprocessing to your schema
const baseSchema = createInsertSchema(depreciationBookModel).extend({
  createdAt: dateStringToDate,
  updatedAt: dateStringToDate,
});

const createDepreiciaitonBookSchema = baseSchema;

const editDepreiciaitonBookSchema = createDepreiciaitonBookSchema.omit({
  id: true,
  createdAt: true,
  createdBy: true,
}) .extend({
  name: createDepreiciaitonBookSchema.shape.name.optional(),
  description: createDepreiciaitonBookSchema.shape.description.optional(),
});


export const createDepreiciaitonBookController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    requirePermission(req, 'create_depriciaiton'); 
    const depreiciaitonBookData = createDepreiciaitonBookSchema.parse(req.body);
    console.log("🚀 ~ depreiciaitonBookData:", depreiciaitonBookData)
    const depreiciaitonBook = await createDepBook(depreiciaitonBookData);

    res.status(201).json(depreiciaitonBook);
  } catch (error) {
    next(error);
  }
};

export const getAllDepreiciaitonBooksController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
 //   requirePermission(req, 'view_all_depriciaiton');
    const depreiciaitonBooks = await getAllDepBooks();
    console.log(depreiciaitonBooks);

    res.status(200).json(depreiciaitonBooks);
  } catch (error) {
    next(error);
  }
};

export const getDepreiciaitonBookController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    //requirePermission(req, 'view_depriciaiton'); 
    const id: number = Number(req.params.id);
    const depreiciaitonBooks = await getDepBookById(id);
    console.log(depreiciaitonBooks);

    res.status(200).json(depreiciaitonBooks);
  } catch (error) {
    next(error);
  }
};
export const editDepreiciaitonBookController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    requirePermission(req, 'edit_depriciaiton'); 
    const id: number = Number(req.params.id);
    const depreiciaitonBookData = editDepreiciaitonBookSchema.parse(req.body);
    const depreiciaitonBook = await editDepBook(id, depreiciaitonBookData);
   
    

    res.status(200).json(depreiciaitonBook);
  } catch (error) {
    next(error);
  }
};