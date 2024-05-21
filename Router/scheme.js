import express from "express";
import {
  get_scheme,
  edit_scheme,
  list,
  add_scheme,
  remove_scheme,
} from "../Controllers/schemeController.js";

const router = express.Router();

router.get("/list", list);

router.get("/get-scheme", get_scheme);

router.post("/add-scheme", add_scheme);

router.delete("/remove-scheme", remove_scheme);

router.put("/edit-scheme", edit_scheme);

export default router;
