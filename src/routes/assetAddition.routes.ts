
import express from 'express';
import { createAssetAdditionController, editAssetAdditionController, getAllAssetAdditionController, getAssetAdditionByIdController } from '../controllers/assetAddition.controller';

const router = express.Router();

router.post('/create', createAssetAdditionController);
router.get('/getall', getAllAssetAdditionController);
router.get('getById/:id', getAssetAdditionByIdController);
router.put('edit/:id', editAssetAdditionController);

export default router;
