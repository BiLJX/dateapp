import { Router } from "express";
import { NotificationsController } from "../controller/notifications-controller";
const router = Router()

router.get("/", NotificationsController);

export { router as NotificationsRouter }