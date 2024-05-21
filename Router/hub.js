import express from "express";

import {
  accept_send_parcels,
  parcels_in_hub_id,
} from "../Controllers/hubController.js";

const router = express.Router();

router.post("/parcels", parcels_in_hub_id);
router.put("/accept-send-parcels", accept_send_parcels);

export default router;
