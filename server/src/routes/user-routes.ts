import { Router } from "express";
import { editUserProfile, getCurrentUser, getUserByUid, getUsers } from "../controller/user-controller";

const router = Router()


//get routes
router.get("/", getUsers)
router.get("/current", getCurrentUser)
router.get("/:uid", getUserByUid)

//patch routes
router.patch("/edit", editUserProfile)


export default router
