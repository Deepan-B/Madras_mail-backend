import exp from "express";

import {
  remove_news,
  view_news,
  add_news,
} from "../Controllers/newsController.js";

const router = exp.Router();

router.get("/view-news", view_news);
router.post("/add-news", add_news); //Only Admin
router.delete("/remove-news", remove_news);
export default router;
