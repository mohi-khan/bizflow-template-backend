import { eq } from "drizzle-orm";
import { db } from "../../config/database";
import {  depreciationTransactionModel,  NewDepTrac } from "../../schemas";
import { BadRequestError } from "../utils/errors.utils";



export const createDepTrack = async (
  depTrac: NewDepTrac
) => {
  try {
    const [newDepTrac] = await db.insert(depreciationTransactionModel).values(
      depTrac
    );

    return newDepTrac;
  } catch (error) {
    throw error;
  }
};
//Helper funciton for Get All DepInfos
export const getAllDepTrac = async () => {
  const depTracs = await db.select().from(depreciationTransactionModel);
  return depTracs;
};

// Helper function to get depInfo by ID
export const getDepInfoByAssetId = async (assetId: number) => {
    const depTrac = await db
        .select()
        .from(depreciationTransactionModel)
        .where(eq(depreciationTransactionModel.assetId, assetId));

    if (!depTrac.length) {
        throw BadRequestError("Dep Track not found");
    }

    return depTrac;
};
//for Getting Distinct periods

export const getDistinctPeriod = async () => {
    const depPeriod = await db
        .selectDistinct({
          period:depreciationTransactionModel.period
        })
        .from(depreciationTransactionModel)
      

    if (!depPeriod.length) {
        throw BadRequestError("Dep Period is empty");
    }

    return depPeriod;
};

