import { eq } from "drizzle-orm";
import { db } from "../config/database";

import { BadRequestError } from "./utils/errors.utils";
import { locationModel, NewLocation } from "../schemas/schema";

// Create a new Location
export const createLocation = async (locationData: NewLocation) => {
  try {
    const [newLocation] = await db
      .insert(locationModel)
      .values(locationData)
      .$returningId();

    return newLocation;
  } catch (error) {
    throw error;
  }
};

// Get Location by ID
export const getLocationById = async (LocationId: number) => {
  const location = await db
    .select()
    .from(locationModel)
    .where(eq(locationModel.id, LocationId))
    .limit(1);

  if (!location.length) {
    throw BadRequestError("Location not found");
  }

  return location[0];
};

// Get all Locations
export const getAllLocations = async () => {
  const locations = await db.select().from(locationModel);

  if (!locations.length) {
    throw BadRequestError("No Locations found");
  }

  return locations;
};

// Update Location
export const updateLocation = async (
  locationId: number,
  locationData: Partial<NewLocation>
) => {
  const existingLocation = await getLocationById(locationId);

  if (
    locationData.name &&
    locationData.name !== existingLocation.name
  ) {
    const nameExists = await db
      .select()
      .from(locationModel)
      .where(eq(locationModel.name, locationData.name))
      .limit(1);

    if (nameExists.length > 0) {
      throw BadRequestError("Location name already exists");
    }
  }

  const [updatedLocation] = await db
    .update(locationModel)
    .set(locationData)
    .where(eq(locationModel.id, locationId));

  return updatedLocation;
};

// Delete Location
export const deleteLocation = async (locationId: number) => {
  await getLocationById(locationId); // Check if exists

  await db.delete(locationModel).where(eq(locationModel.id, locationId));

  return { message: "Location deleted successfully" };
};
