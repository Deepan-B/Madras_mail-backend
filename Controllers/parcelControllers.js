import express from "express";
import { db } from "../Database/dbConnect.js";

export const price_calc = async (req, res) => {
  const { weight, type } = req.body;
  // console.log(req.body);
  let price;
  try {
    if (type === "express")
      //type can be express delivery or standard
      price = weight * 25;
    else price = weight * 15; //for standard Rs.15/kg

    res.status(200).json({
      message: `Price is ${price} for ${type} delivery with a weight of ${weight} Kgs.`,
    });
  } catch (e) {
    console.log(e);
  }
};

export const find_parcel_sent_by_customer = async (req, res) => {
  try {
    const { customer_id } = req.body;
    const all_parcels_sent_by_id = await db.query(
      "select * from parcel where customer_id = $1",
      [customer_id]
    );
    if (all_parcels_sent_by_id.rowCount === 0)
      return res
        .status(200)
        .json({ message: `No Parcel found with customer id : ${customer_id}` });
    res.status(200).json({
      message: ` ${all_parcels_sent_by_id.rowCount} Pacrels Found `,
      data: { ...all_parcels_sent_by_id.rows },
    });
  } catch (err) {
    res.status(500).json({
      sucess: false,
      message: "internal server error , try again",
      error: `${err}`,
    });
  }
};



export const find_parcel_received_by_customer = async (req, res) => {
  try {
    const { customer_id } = req.body;
    const all_parcels_received_by_id = await db.query(
      "select * from parcel where customer_id = $1",
      [customer_id]
    );
    if (all_parcels_received_by_id.rowCount === 0)
      return res
        .status(200)
        .json({ message: `No Parcel found with customer id : ${customer_id}` });
    res.status(200).json({
      message: ` ${all_parcels_received_by_id.rowCount} Pacrels Found `,
      data: { ...all_parcels_received_by_id.rows },
    });
  } catch (err) {
    res.status(500).json({
      sucess: false,
      message: "internal server error , try again",
      error: `${err}`,
    });
  }
};

export const find_parcel = async (req, res) => {
  try {
    console.log(req.body.parcel_id);
    const { parcel_id } = req.body;
    const found_parcel = await db.query(
      "select * from parcel where parcel_id= $1",
      [parcel_id]
    );
    if (found_parcel.rowCount === 0)
      return res
        .status(404)
        .json({ message: `No Parcel found with parcel id : ${parcel_id}` });
    const { from_place, to_place } = found_parcel.rows[0];
        const from_hub=await db.query("select * from connector natural join hub where post_office_id in (select post_office_id from post_office where sub_post ilike $1)",[from_place]);
        const to_hub=await db.query("select * from connector natural join hub where post_office_id in (select post_office_id from post_office where sub_post ilike $1)",[to_place]);
    // console.log(from_hub); console.log(to_hub);
    const from_hub_name = from_hub.rows[0].hub_name;
    const to_hub_name = to_hub.rows[0].hub_name;
    // console.log(from_hub_name);
    // res.status(200).json({
    //   message: `Parcel found with parcel id ${parcel_id} , From place : ${from_place}, TO place ${to_place} , weight`
    //   // data: found_parcel.rows
    // });
    const parcel_details = {
      ...found_parcel.rows[0],
      from_hub_name,
      to_hub_name,
    };

    res.status(200).json({ message: "Parcel found ", data: parcel_details });
  } catch (err) {
    res.status(500).json({
      sucess: false,
      message: "internal server error , try again",
      error: `${err}`,
    });
  }
};

export const send_parcel = async (req, res) => {
  const { from, to, weight, type, email } = req.body;
  try {
    let sender = await db.query("select id from account where username ilike $1", [
      email,
    ]);

    if (sender.rowCount == 0) {
      return res.status(404).json({ message: "Sender's doesn't exists" });
    }
    let { id } = sender.rows[0];
    // console.log(from);
    // console.log(to);
    // console.log(weight);
    // console.log(type);
    // console.log(email);
    let price;

    //  PRICE SHLD be multiplied with no. of hubs in between from and to address  i.e price =25*weight * No_of_hubs_bet_places;

    if (type === "express")
      //type can be express delivery or standard
      price = weight * 25;
    else price = weight * 15; //for standard Rs.15/kg

    async function generateUniqueParcelNumber() {
      let uniqueNumber;
      do {
        // Generate a random 5-digit number
        uniqueNumber = Math.floor(Math.random() * 100000);
      } while (await isParcelInUse(uniqueNumber)); // Check for uniqueness

      return uniqueNumber.toString().padStart(5, "0"); // Ensure 5 digits, prepend zeros
    }

    // Function to check if a parcvel id already exists
    async function isParcelInUse(parcelNumber) {
      //const client = await db.connect();
      const result = await db.query(
        "SELECT 1 FROM parcel WHERE parcel_id = $1",
        [parcelNumber]
      );
      // db.release();
      return result.rows.length > 0; // True if the number exists
    }

    const parcel_id = await generateUniqueParcelNumber();
    // console.log(parcel_id);console.log(id);

    const hub = await db.query(
      "select hub_id from connector natural join hub where post_office_id in (select post_office_id from post_office where sub_post ilike $1)",
      [from]
    );
    // console.log(hub.rows);
    const { hub_id } = hub.rows[0];
    //  console.log(hub_id);

    const parcel = await db.query(
      "insert into parcel (from_place,to_place,weight,price,delivery_type,customer_id,parcel_id,status,status_no) values($1,$2,$3,$4,$5,$6,$7,$8,1)",
      [
        from,
        to,
        weight,
        price,
        type,
        id,
        parcel_id,
        `initiated and sent to hub ${hub_id}`,
      ]
    );
    // price=await db.query("select parcel_id from parcel ")
    res.status(200).json({
      message: `Parcel has been successfully posted with parcel id : ${parcel_id}`,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: "Cannot post parcel!! Retry later " });
  }
};
