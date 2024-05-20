import express, { Router } from "express"

import {give_feedback,list_all_feedback} from "../Controllers/feedbackControllers.js"

const router = express.Router();

router.post("/give-feedback",give_feedback);

router.get("/list",list_all_feedback);


export default router;