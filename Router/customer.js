import express from "express";

// const app=express();
import {create_bank_acc,delete_bank_acc,transaction_in_bank,list_transaction} from "../Controllers/bank_account_Controllers.js";

import {send_parcel,find_parcel,price_calc,find_parcel_sent_by_customer} from "../Controllers/parcelControllers.js";

import {send_money_order,sent_by_customer,specific_MOS} from "../Controllers/moneyorderControllers.js"

// import {trial} from "../Controllers/parcelControllers.js"


// import { bank_acc_route } from "../Router/bank_account.js";
const router=express.Router();
// app.use("/bank_account",bank_acc_route)

router.post("/create-bank_acc",create_bank_acc);
router.delete("/delete-bank_acc",delete_bank_acc);

router.put("/transaction",transaction_in_bank);
router.get("/list-transaction",list_transaction);

router.post("/parcel/post",send_parcel);
router.get("/parcel/find",find_parcel);
router.get("/customer/parcel",find_parcel_sent_by_customer);
router.get("/price-calc",price_calc);
// router.get("/trial",trial);


router.get("/money-order/find",specific_MOS);
router.get("/money-order/by-customer",sent_by_customer);
router.post("/money-order/send",send_money_order);

export default router;