import {db} from "../Database/dbConnect.js"

export const parcels_in_hub_id=async (req,res)=>{

    const {hub_id}=req.body;

    

    const is_available= await db.query("select * from hub where hub_id = $1 ",[hub_id]);
    if(is_available.rowCount===0)
        return res.status(404).json({message:`No hub is found with hub id ${hub_id}`});

    const {rows}= await db.query(`SELECT parcel_id FROM parcel WHERE status ILIKE '%' || $1   `,[`hub ${hub_id}`]);

    if(rows==0)
        {
          return res.status(200).json({message:`No parcel to be listed in this HUB with hub-id : ${hub_id}`});
        }
  const parcelIds = rows.map(row => row.parcel_id);
  res.json({ parcelIds });
  


};

export const accept_send_parcels=async(req,res)=>{


const {parcel_id}= req.body;

const p_details=await db.query("select * from parcel where parcel_id = $1",[parcel_id]);
if (p_details.rowCount === 0) {
    return res.status(404).send('Parcel not found');
  }
const{from_place,to_place,status,status_no} =p_details.rows[0];

// const from_hub=await db.query("select * from connector ")
const from_hub=await db.query("select * from connector natural join hub where post_office_id in (select post_office_id from post_office where sub_post ilike $1)",[from_place]);
const to_hub=await db.query("select * from connector natural join hub where post_office_id in (select post_office_id from post_office where sub_post ilike $1)",[to_place]);
// console.log(to_hub.rows);
if (from_hub.rowCount === 0 || to_hub.rowCount === 0) {
    return res.status(400).send('Missing connector hub information');
  }
// console.log(from_hub.rows);
const target_hub_id = to_hub.rows[0].hub_id;
const sent_hub_id=from_hub.rows[0].hub_id;
// if(status_no===1)
//     {
//         const change= await db.query("update parcel set status='sent to hub $1' where parcel_id = $2",[target_hub_id,parcel_id]);
//     }

const target_PO=await db.query("select * from post_office where sub_post ilike $1",[to_place]);
const target_PO_id=target_PO.rows[0].post_office_id;

if(status_no===1 && (sent_hub_id === target_hub_id))
    {
        // console.log(sent_hub_id);
        // console.log(target_hub_id);
        // console.log(target_PO_id);
        // console.log(parcel_id);
        // console.log(sent_hub_id);
        await db.query("UPDATE parcel SET status = $1 WHERE parcel_id = $2", ['received and sent to post_office '+target_PO_id, parcel_id]);
        await db.query("update parcel set status_no = 3 where parcel_id =$1",[parcel_id]);    
        res.status(200).json({message:`Status of Parcel with parcel id ${parcel_id} has been updated ` });
        res.end();
    }

if (status_no === 1) {
    await db.query("UPDATE parcel SET status = $1 WHERE parcel_id = $2", ['received and sent to hub '+target_hub_id, parcel_id]);
    await db.query("update parcel set status_no = 2 where parcel_id =$1",[parcel_id]);
    res.status(200).json({message:`Status of Parcel with parcel id ${parcel_id} has been updated ` });
    res.end();
}  
if (status_no === 2) {
    await db.query("UPDATE parcel SET status = $1 WHERE parcel_id = $2", ['received and sent to post_office '+target_PO_id, parcel_id]);
    await db.query("update parcel set status_no = 3 where parcel_id =$1",[parcel_id]);
    res.status(200).json({message:`Status of Parcel with parcel id ${parcel_id} has been updated ` });
    res.end();
}  

// const updateQuery = 'UPDATE parcel SET status = $1 WHERE parcel_id = $2';
// const values = ['sent to hub ' + target_hub_id, parcel_id];

// await db.query(updateQuery, values);

// console.log(from_place);
// console.log(status_no);
// console.log(status);
// console.log(to_place);
res.end();
};

