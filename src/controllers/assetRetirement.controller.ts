
import { Request, Response } from "express";
import { createAssetRetirement, getAllAssetRetirement, getAssetRetirementById, editAssetRetirement } from "../services/assetRetirement.service";
import { requirePermission } from "../services/utils/jwt.utils";

// Create new asset retirement
export const createAssetRetirementController = async (req: Request, res: Response) => {
  try {
    requirePermission(req, 'create_retirement');
    const newAssetRetirement = await createAssetRetirement(req.body);
    res.status(201).json({
      success: true,
      data: newAssetRetirement,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    res.status(400).json({
      success: false,
      message: errorMessage,
    });
  }
};

// Get all asset retirements
export const getAllAssetRetirementController = async (req: Request, res: Response) => {
  try {
    requirePermission(req, 'view_retirement');
    const assetRetirements = await getAllAssetRetirement();
    res.status(200).json(assetRetirements);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    res.status(400).json({
      success: false,
      message: errorMessage,
    });
  }
};

// Get asset retirement by ID
export const getAssetRetirementByIdController = async (req: Request, res: Response) => {
  try {
    requirePermission(req, 'view_retirement_by_id');
    const assetId = parseInt(req.params.id);
    const assetRetirement = await getAssetRetirementById(assetId);
    res.status(200).json(assetRetirement);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    res.status(400).json({
      success: false,
      message: errorMessage,
    });
  }
};

// Update asset retirement
export const editAssetRetirementController = async (req: Request, res: Response) => {
  try {
    requirePermission(req, 'edit_retirement');
    const assetRetirementId = parseInt(req.params.id);
    const updatedAssetRetirement = await editAssetRetirement(assetRetirementId, req.body);
    res.status(200).json({
      success: true,
      data: updatedAssetRetirement,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    res.status(400).json({
      success: false,
      message: errorMessage,
    });
  }
};
