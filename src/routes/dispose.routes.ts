import { Router } from "express";
import { authenticateUser } from "../middlewares/auth.middleware";
import { createDisposeController, editDisposeController, getAllDisposeController, getDisposeByDisposeDateAndCompanyController, getDisposeByIdController } from "../controllers/dispose.controller";

const router = Router();

router.post("/create",authenticateUser, createDisposeController);
router.get("/getall",authenticateUser, getAllDisposeController);
router.get('/getByDisposeDate/:dispose_date/:company_id', authenticateUser, getDisposeByDisposeDateAndCompanyController);
router.get('/getDetails/:id', authenticateUser, getDisposeByIdController);
router.patch("/edit/:id",authenticateUser, editDisposeController);

export default router;
