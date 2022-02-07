import { Router } from "express";
import { getChatData, getMessages } from "../controller/message-controller";

const router = Router();

router.get("/:uid", getChatData);
router.get("/:uid/messages", getMessages)
export { router as ChatRoutes }
