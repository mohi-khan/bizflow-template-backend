import express from 'express';
import { activateCostCenterController, createCostCenterController, deactivateCostCenterController, deleteCostCenterController, editCostCenterController, getAllCostCentersController } from '../controllers/cost-centers.controller';
import { authenticateUser } from '../middlewares/auth.middleware';

const router = express.Router();

router.post('/create',authenticateUser, createCostCenterController);
router.get('/getall', authenticateUser,getAllCostCentersController);
router.patch('/edit/:id',authenticateUser, editCostCenterController);
router.patch('/activate/:id',authenticateUser, activateCostCenterController);
router.patch('/deactivate/:id',authenticateUser, deactivateCostCenterController);
router.delete('/delete/:id',authenticateUser, deleteCostCenterController);
export default router;