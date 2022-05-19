import { Router } from "express";
import { getFeedSettings, updateFeedSettings } from "../controller/settings-controller";

const router = Router();


//get
router.get("/feed", getFeedSettings)
router.get("/account")

//patch
router.patch("/feed/update", updateFeedSettings)
router.patch("/feed/update")

export { router as SettingsRouter }