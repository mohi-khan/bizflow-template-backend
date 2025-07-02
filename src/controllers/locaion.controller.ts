import { NextFunction, Request, Response } from "express";
import { z } from "zod";

import { createInsertSchema } from "drizzle-zod";

import { requirePermission } from "../services/utils/jwt.utils";
import { locationModel } from "../schemas";
import { createLocation, getAllLocations, getLocationById, updateLocation } from "../services/location.service";




const createLocationSchema = createInsertSchema(locationModel)
const editLocationSchema = createLocationSchema.omit({
  id: true
 
}) 
export const createLocationController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    requirePermission(req, 'create_location'); 
    const locationData = createLocationSchema.parse(req.body);
    const location = await createLocation(locationData);

    res.status(201).json({
      status: "success",
      data: {
        location,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getAllLocationsController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    requirePermission(req, 'view_location'); 
    const locations = await getAllLocations();
    console.log(locations);

    res.status(200).json(locations);
  } catch (error) {
    next(error);
  }
};

export const getLocationController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    requirePermission(req, 'view_location'); 
    const id: number = Number(req.params.id);
    const locations = await getLocationById(id);
    console.log(locations);

    res.status(200).json(locations);
  } catch (error) {
    next(error);
  }
};
export const editLocationController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    requirePermission(req, 'edit_location'); 
    const id: number = Number(req.params.id);
    const locationData = editLocationSchema.parse(req.body);
    const location = await updateLocation(id, locationData);
   
    

    res.status(200).json(location);
  } catch (error) {
    next(error);
  }
};