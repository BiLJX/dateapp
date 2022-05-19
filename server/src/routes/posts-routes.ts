import { Router } from "express";
import { deletePost, getFeedPictures, getPictureById, getUsersPictures, like, postPicture, unLike } from "../controller/post-controller";

const router = Router();

//get
router.get("/pictures", getFeedPictures)
router.get("/pictures/:uid", getUsersPictures)
router.get("/picture/:id", getPictureById)
//post
router.post("/picture/post", postPicture)

//put
router.put("/picture/like/:id", like);
router.put("/picture/unLike/:id", unLike);


//delete
router.delete("/picture/delete/:id", deletePost)
export { router as PostRoutes }