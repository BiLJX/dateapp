import { Router } from "express";
import { addHobby, getHobbies, getUserHobby, removeHobby } from "../controller/hobby-controller";
const router = Router()

router.get("/", getHobbies)
router.get("/:uid", getUserHobby)

router.put("/hobby/add", addHobby)
router.put("/music/add",)

router.delete("/hobby/:hobby", removeHobby)
router.delete("/music/:remove")

export { router as HobbyRouter }