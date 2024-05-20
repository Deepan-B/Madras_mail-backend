import express from "express";
import {remove_stamp,add_stamp,list_stamp} from "../Controllers/stampController.js"
const router =express.Router();


router.post("/add-stamp",add_stamp);
router.delete("/remove-stamp",remove_stamp)
router.get("/list",list_stamp);

export default router;