import {db } from "../Database/dbConnect.js"

export const send_money_order = async(req,res)=>{
const {amount,receiver_id,sender_id}=req.body;


    const accounts = await db.query("select * from customer where customer_id = $1 or customer_id = $2",[sender_id,receiver_id]);
  
      if (accounts.rowCount === 0) {
        return res.status(404).json({ message: "Sender's or receiver's  account doesn't exist" });
      }


      async function generateUniqueMONumber() {
        let uniqueNumber;
        do {
          // Generate a random 5-digit number
          uniqueNumber = Math.floor(Math.random() * 100000);
        } while (await isMOInUse(uniqueNumber)); // Check for uniqueness
      
        return uniqueNumber.toString().padStart(5, '0'); // Ensure 5 digits, prepend zeros
      }
      
      // Function to check if a parcvel id already exists
      async function isMOInUse(parcelNumber) {
    
      //const client = await db.connect();
          const result = await db.query('SELECT 1 FROM money_order WHERE money_order_id = $1', [parcelNumber]);
         // db.release();
          return result.rows.length > 0; // True if the number exists
        
    };
    
    const MO_id=await generateUniqueMONumber();


      await db.query("insert into money_order (amount,receiver_id,sender_id,money_order_id) values($1,$2,$3,$4)",[amount,receiver_id,sender_id,MO_id]);
      res.status(200).json({message:`MOney Order has been successfully Sent with Money Order id  : ${MO_id}`});

  

};


export const specific_MOS=async(req,res)=>{
    try{
      const {money_order_id}=req.body;
      const found_parcel = await db.query("select * from money_order where money_order_id= $1",[money_order_id]);
      if(found_parcel.rowCount===0)
        return res.status(404).json({message:`No Money Order found with MO id : ${money_order_id}`});
      res.status(200).json({message:"Money Order Found ",data:found_parcel.rows});
    
    }catch (err) {
        res.status(500).json({
          sucess: false,
          message: "internal server error , try again",
          error: `${err}`,
        });
      }
}
    
    



export const sent_by_customer = async (req,res)=>{
    try{
      const {customer_id}=req.body;
      const all_MO_sent_by_id=await db.query("select * from money_order where sender_id = $1",[customer_id]);
      if(all_MO_sent_by_id.rowCount===0)
          return res.status(200).json({message:`No Money Order found with customer id : ${customer_id}`});
        res.status(200).json({message:` ${all_MO_sent_by_id.rowCount} Money Orders  Found `,data:{...all_MO_sent_by_id.rows}});
  }
  catch (err) {
    res.status(500).json({
      sucess: false,
      message: "internal server error , try again",
      error: `${err}`,
    });
  }
};