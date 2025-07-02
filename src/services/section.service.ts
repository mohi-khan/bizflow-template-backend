import { eq } from "drizzle-orm";
import { db } from "../config/database";

import { BadRequestError } from "./utils/errors.utils";
import {  NewSection, sectionModel } from "../schemas/schema";

// Create a new Section
export const createSection = async (sectionData: NewSection) => {
  try {
    const [newSection] = await db
      .insert(sectionModel)
      .values(sectionData)
      .$returningId();

    return newSection;
  } catch (error) {
    throw error;
  }
};

// Get Section by ID
export const getSectionById = async (sectionId: number) => {
  const section = await db
    .select()
    .from(sectionModel)
    .where(eq(sectionModel.id, sectionId))
    .limit(1);

  if (!section.length) {
    throw BadRequestError("Section not found");
  }

  return section[0];
};

// Get all Sections
export const getAllSections = async () => {
  const Sections = await db.select().from(sectionModel);

  if (!Sections.length) {
    throw BadRequestError("No Sections found");
  }

  return Sections;
};

// Update Section
export const updateSection = async (
  sectionId: number,
  sectionData: Partial<NewSection>
) => {
  const existingSection = await getSectionById(sectionId);

  if (
    sectionData.name &&
    sectionData.name !== existingSection.name
  ) {
    const nameExists = await db
      .select()
      .from(sectionModel)
      .where(eq(sectionModel.name, sectionData.name))
      .limit(1);

    if (nameExists.length > 0) {
      throw BadRequestError("Section name already exists");
    }
  }

  const [updatedSection] = await db
    .update(sectionModel)
    .set(sectionData)
    .where(eq(sectionModel.id, sectionId));

  return updatedSection;
};

// Delete Section
export const deleteSection = async (sectionId: number) => {
  await getSectionById(sectionId); // Check if exists

  await db.delete(sectionModel).where(eq(sectionModel.id, sectionId));

  return { message: "Section deleted successfully" };
};
