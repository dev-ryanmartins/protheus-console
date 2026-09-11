import { Router, type IRouter } from "express";
import healthRouter from "./health";
import protheusRouter from "./protheus";

const router: IRouter = Router();

router.use(healthRouter);
router.use(protheusRouter);

export default router;
