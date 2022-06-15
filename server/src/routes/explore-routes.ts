import { Router } from "express";
import { getExploreContents, getQuickChats } from "../controller/explore-controller";

const router = Router();

router.get("/", getExploreContents);
router.get("/quickchats", getQuickChats)
export { router as ExploreRouter }