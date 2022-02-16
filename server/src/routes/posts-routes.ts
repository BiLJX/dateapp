import { Router } from "express";
import { getFeedPictures, getUsersPictures, like, postPicture, unLike } from "../controller/post-controller";

const router = Router();

//get
router.get("/pictures", getFeedPictures)
router.get("/pictures/:uid", getUsersPictures)
//post
router.post("/picture/post", postPicture)

//put
router.put("/picture/like/:id", like);
router.put("/picture/unLike/:id", unLike);

export { router as PostRoutes }