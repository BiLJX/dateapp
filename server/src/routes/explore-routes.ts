import { Router } from "express";
import { getExploreContents } from "../controller/explore-controller";

const router = Router();

router.get("/", getExploreContents);

export { router as ExploreRouter }