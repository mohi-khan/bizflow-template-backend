import { eq } from "drizzle-orm";
import { db } from "../config/database";
import { CostCenter, costCenterModel, NewCostCenter } from "../schemas";
import { BadRequestError } from "./utils/errors.utils";




export const createCostCenter = async (costCenterData: Omit<NewCostCenter, 'costCenterId'>) => {
    try {
        const [newCostCenter] = await db
            .insert(costCenterModel)
            .values({
                ...costCenterData,
                createdAt: new Date(), // Add timestamps if necessary
            });

        return newCostCenter;
    } catch (error) {
        throw error;
    }
};

export const getAllCostCenters = async () => {
    const costCenters = await db.select().from(costCenterModel);
    return costCenters;
};

export const editCostCenter = async (
    costCenterId: number,
    costCenterData: Partial<CostCenter>
) => {
    const existingCostCenter = await getCostCenterById(costCenterId);

    const [updatedCostCenter] = await db
        .update(costCenterModel)
        .set({
            ...costCenterData,
         
        })
        .where(eq(costCenterModel.costCenterId, costCenterId))

    return updatedCostCenter;
};

export const activateCostCenter = async (costCenterId: number) => {
    const [activatedCostCenter] = await db
        .update(costCenterModel)
        .set({
            isActive: true,
           
        })
        .where(eq(costCenterModel.costCenterId, costCenterId))

    return activatedCostCenter;
};

export const deactivateCostCenter = async (costCenterId: number) => {
    const [deactivatedCostCenter] = await db
        .update(costCenterModel)
        .set({
            isActive: false,
            
        })
        .where(eq(costCenterModel.costCenterId, costCenterId))

    return deactivatedCostCenter;
};

export const deleteCostCenter = async (costCenterId: number) => {
    await getCostCenterById(costCenterId); // Check if cost center exists

    await db
        .delete(costCenterModel)
        .where(eq(costCenterModel.costCenterId, costCenterId));

    return { message: "Cost center deleted successfully" };
};

// Helper function to get cost center by ID
const getCostCenterById = async (costCenterId: number) => {
    const costCenter = await db
        .select()
        .from(costCenterModel)
        .where(eq(costCenterModel.costCenterId, costCenterId))
        .limit(1);

    if (!costCenter.length) {
        throw BadRequestError("Cost center not found");
    }

    return costCenter[0];
};