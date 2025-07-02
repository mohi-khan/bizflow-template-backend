import { NextFunction, Request, Response } from "express";
import { z } from "zod";

import { createInsertSchema } from "drizzle-zod";

import { requirePermission } from "../services/utils/jwt.utils";
import { sectionModel } from "../schemas";
import { createSection, getAllSections, getSectionById, updateSection } from "../services/section.service";




const createSectionSchema = createInsertSchema(sectionModel)
const editSectionSchema = createSectionSchema.omit({
  id: true
 
}) 
export const createSectionController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    requirePermission(req, 'create_section'); 
    const sectionData = createSectionSchema.parse(req.body);
    const section = await createSection(sectionData);

    res.status(201).json({
      status: "success",
      data: {
        section,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getAllSectionsController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    requirePermission(req, 'view_section'); 
    const sections = await getAllSections();
    

    res.status(200).json(sections);
  } catch (error) {
    next(error);
  }
};

export const getSectionController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    requirePermission(req, 'view_section'); 
    const id: number = Number(req.params.id);
    const sections = await getSectionById(id);


    res.status(200).json(sections);
  } catch (error) {
    next(error);
  }
};
export const editSectionController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    requirePermission(req, 'edit_section'); 
    const id: number = Number(req.params.id);
    const sectionData = editSectionSchema.parse(req.body);
    const section = await updateSection(id, sectionData);
   
    

    res.status(200).json(section);
  } catch (error) {
    next(error);
  }
};