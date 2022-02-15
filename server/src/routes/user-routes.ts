import { Router } from "express";
import { uploadPfp } from "../controller/image-controller";
import { editUserProfile, getCurrentUser, getUserByUid, getUsers, saveUser, unsaveUser } from "../controller/user-controller";

const router = Router()


//get routes
router.get("/", getUsers)
router.get("/current", getCurrentUser)
router.get("/:uid", getUserByUid)

//patch routes
router.patch("/edit", editUserProfile)

//put routes
router.put("/:uid/save", saveUser)
router.put("/edit/pfp", uploadPfp)

//delete routes
router.delete("/:uid/unsave", unsaveUser)
export default router
