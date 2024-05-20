import express from "express";
import {create_bank_acc,delete_bank_acc} from "../Controllers/bank_account_Controllers.js";

const bank_acc_route=express.Route();

bank_acc_route.post("/create-bank_acc",create_bank_acc);

bank_acc_route.delete("/delete-bank_acc",delete_bank_acc);
module.exports = bank_acc_route ;
// export default bank_acc_route;