import { Request, Response } from 'express';
import { createAssetAddition, editAssetAddition, getAllAssetAddition, getAssetAdditionById } from '../services/assetAddition.service';
import { requirePermission } from '../services/utils/jwt.utils';

export const createAssetAdditionController = async (req: Request, res: Response) => {
  try {
    // requirePermission(req, 'create_addition');
    const assetAdditionData = req.body;
    const newAssetAddition = await createAssetAddition(assetAdditionData);
    res.status(201).json({
      status: "success",
      data: newAssetAddition
    });
  } catch (error: any) {
    res.status(400).json({
      status: "error",
      message: error.message
    });
  }
};

export const getAllAssetAdditionController = async (req: Request, res: Response) => {
  try {
    requirePermission(req, 'view_addition');
    const assetAdditions = await getAllAssetAddition();
    res.status(200).json(assetAdditions);
  } catch (error: any) {
    res.status(400).json({
      status: "error",
      message: error.message
    });
  }
};

export const getAssetAdditionByIdController = async (req: Request, res: Response) => {
  try {
    requirePermission(req, 'view_addition_by_id');
    const assetId = parseInt(req.params.id);
    const assetAddition = await getAssetAdditionById(assetId);
    res.status(200).json(assetAddition);
  } catch (error: any) {
    res.status(400).json({
      status: "error",
      message: error.message
    });
  }
};

export const editAssetAdditionController = async (req: Request, res: Response) => {
  try {
    requirePermission(req, 'edit_addition');
    const assetAdditionId = parseInt(req.params.id);
    const assetAdditionData = req.body;
    const updatedAssetAddition = await editAssetAddition(assetAdditionId, assetAdditionData);
    res.status(200).json({
      status: "success",
      data: updatedAssetAddition
    });
  } catch (error: any) {
    res.status(400).json({
      status: "error",
      message: error.message
    });
  }
};
