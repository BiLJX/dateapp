import { Router } from "express";
import { changeEmail, createAccount, login, sendVerification } from "../controller/auth-controller";

const router = Router();

//signup route
router.post("/signup", createAccount);

//login route
router.post("/login", login)

//verification
router.post("/verify/email", sendVerification);
router.post("/change/email", changeEmail);
router.post("/signout", (req, res)=>{
    res.clearCookie("session")
    res.status(200).send({status: "ok"})
})

//exporting

export default router