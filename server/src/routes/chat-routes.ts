import { Router } from "express";
import { getChatData } from "../controller/message-controller";

const router = Router();

router.get("/:uid", getChatData);

export { router as ChatRoutes }
