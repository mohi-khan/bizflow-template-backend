import { Router } from "express";
import authRoutes from "./auth.routes";
import companyRoutes from "./company.routes"
import costCenterRoutes from "./cost-centers.routes"
import departmentRoutes from "./department.routes"
import supplierRoutes from "./supplier.routes"
import categoryRoutes from "./category.routes"
import assetRoutes from "./asset.routes"
import locationRoutes from "./location.routes"
import sectionRoutes from "./section.routes"
import depBookRoutes from "./depriciation/depbook.routes"
import depinfoRoutes from "./depriciation/depinfo.routes"
import depCalculation from "./depriciation/depCalcualtion.route"
import warrantyRoutes from "./warranty.routes"
import maintenanceRoutes from "./maintenance.routes"
import disposeRoute from "./dispose.routes"
import assetAdditionRoutes from "./assetAddition.routes"
import assetRetirementRoutes from "./assetRetirement.routes"
import report from "./reports.route"
const router=Router()

router.use('/auth',authRoutes)
router.use('/company',companyRoutes)
router.use('/costCenter',costCenterRoutes)
router.use('/department',departmentRoutes)
router.use('/category',categoryRoutes)
router.use('/supplier',supplierRoutes)
router.use('/asset',assetRoutes)
router.use('/location',locationRoutes)
router.use('/section',sectionRoutes)
router.use('/depBook',depBookRoutes)
router.use('/depInfo',depinfoRoutes)
router.use('/depCalculation',depCalculation)
router.use("/warranty",warrantyRoutes)
router.use("/maintenance",maintenanceRoutes)
router.use("/dispose",disposeRoute)
router.use("/assetAddition", assetAdditionRoutes)
router.use("/assetRetirement", assetRetirementRoutes)
router.use("/report",report)

export default router;