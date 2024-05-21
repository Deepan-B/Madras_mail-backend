import express from "express";

import {
  delivery,
  received,
  main_finder,
  pincode_finder,
  sub_finder,
  id_finder,
  any_finder,
} from "../Controllers/officeControllers.js";

const router = express.Router();

router.post("/id", id_finder);
router.post("/main_post", main_finder);
router.post("/sub_post", sub_finder);
router.post("/pincode", pincode_finder);

router.post("/find", any_finder); //errors//now working finely
router.post("/delivery", delivery);
router.post("/received", received);
export default router;
