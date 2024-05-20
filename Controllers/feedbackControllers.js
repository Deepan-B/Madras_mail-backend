import {db} from "../Database/dbConnect.js";
import express from "express";

export const list_all_feedback = async (req, res) => {
    
    try {
        const output = await db.query("select * from feedback");
        
        if (output.rowCount > 0) {
            return res.status(200).json({
                data: output.rows
            })
        }
        else {
            return res.status(404).json({
                message: "There is no feedback available"
            })
        }

    } catch (err) {
        return res.status(500).json({
            message: "internal server error",
            error: err
        })
    }

}
export const give_feedback=async(req,res)=>{

    const { feedback ,customer_id}=req.body;//anyone can give a feedback need not be a customer 
    const is_customer = await db.query("select * from customer where customer_id = $1",[customer_id]);
    if(is_customer.rowCount===0)
        return    res.status(404).json({message:`Customer id ${customer_id}  is not found`});
      
   
    await db.query("insert into feedback(message,user_id) values ($1,$2)",[feedback,customer_id]);
    res.status(200).json({message:"Your FeedBack has been Added Successfully Thank You"});

};