import { Router } from "express";
import { acceptDate, cancelDateRequest, getRequestDate, getUserDates, rejectDate, requestDate, unDate } from "../controller/dates-controller";

const router = Router()

//get requests
router.get("/", getUserDates)
router.get("/requests/incoming", getRequestDate)

//post requests
router.post("/request/:uid", requestDate)
router.post("/request/:uid/accept", acceptDate)

//delete requests
router.delete("/request/:uid/reject", rejectDate)
router.delete("/request/:uid/cancel", cancelDateRequest)
router.delete("/remove/:uid", unDate)
export default router