import express from "express";
import  { db } from "../Database/dbConnect.js";

export const remove_stamp=async(req,res)=>{
try{
    const{stamp_id}=req.body;
    const is_available= await db.query("select * from stamp where stamp_id = $1",[stamp_id] );
    if(is_available.rowCount===0)
       return res.status(404).json({message:`No stamp Available with Stamp id : ${stamp_id}`});
    await db.query("delete from stamp where stamp_id = $1 ",[stamp_id]);
    res.status(200).json({message:`Stamp deleted with a scheme id ${stamp_id}`});
}
catch(e)
{
    
    return res.status(500).json({
        message: "internal server error",
        error: `${e}`
        
    })
}
};
export const list_stamp=async(req,res)=>{

    
    try {
        const output = await db.query("select * from stamp");
        
        if (output.rowCount > 0) {
            return res.status(200).json({
                data: output.rows
            })
        }
        else {
            return res.status(404).json({
                message: "There is no Stamp available"
            })
        }

    } catch (err) {
        return res.status(500).json({
            message: "internal server error",
            error: `${err}`
        })
    }



};

export const add_stamp=async(req,res)=>{
    const { description } =req.body;
    try{
        const currentDate = new Date().toISOString().slice(0, 10); // Get current date (YYYY-MM-DD)
        let stamps = await db.query("select count(*) from stamp");

    await db.query("insert into stamp(stamp_id , description,issue_date) values($1,$2 , $3)",[stamps+1 , description,currentDate]);
    res.status(200).json({message:"Stamp Added Successfully "});
    }
    catch (err) {
        res.status(500).json({
          sucess: false,
          message: "internal server error , try again",
          error: `${err}`,
        });
      }
};
