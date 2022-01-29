import { Router } from "express";
import { createAccount, login } from "../controller/auth-controller";

const router = Router();

//signup route
router.post("/signup", createAccount);

//login route
router.post("/login", login)

//exporting

export default router