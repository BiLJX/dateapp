import { Router } from "express";
import { getFeed } from "../controller/feed-controller";
import { uploadCover, uploadPfp } from "../controller/image-controller";
import { changePersonality, editUserProfile, getCurrentUser, getSavedUsers, getUserByUid, getUsers, saveUser, unsaveUser } from "../controller/user-controller";

const router = Router()


//get routes
router.get("/", getUsers)
router.get("/feed", getFeed)
router.get("/current", getCurrentUser)
router.get("/saved", getSavedUsers)
router.get("/:uid", getUserByUid)

//patch routes
router.patch("/edit", editUserProfile)

//put routes
router.put("/:uid/save", saveUser)
router.put("/edit/pfp", uploadPfp)
router.put("/edit/cover", uploadCover)
router.put("/edit/personality", changePersonality)


//delete routes
router.delete("/:uid/unsave", unsaveUser)

export default router
