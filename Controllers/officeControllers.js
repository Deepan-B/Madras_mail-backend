import { db } from "../Database/dbConnect.js";
let post_office;

export const received = async (req, res) => {
  const { post_office_id } = req.body;
  const is_available = await db.query(
    "select * from post_office where post_office_id = $1 ",
    [post_office_id]
  );
  if (is_available.rowCount === 0)
    return res.status(404).json({
      message: `No Post office  is found with post_office id ${post_office_id}`,
    });

  const { rows } = await db.query(
    `SELECT parcel_id FROM parcel WHERE status ILIKE '%' || $1   `,
    [`post_office ${post_office_id}`]
  );
  if (rows == 0) {

    return res.status(200).json({
      message: `No parcel to be listed in this post office with post_office_id : ${post_office_id}`,
    });

  }
  const parcelIds = rows.map((row) => row.parcel_id);
  res.json({ parcelIds });
};

export const delivery = async (req, res) => {
  const { parcel_id } = req.body;

  const p_details = await db.query(
    "select * from parcel where parcel_id = $1",
    [parcel_id]
  );
  if (p_details.rowCount === 0) {
    return res.status(404).send("Parcel not found");
  }
  const { status, status_no } = p_details.rows[0];

  if (status_no === 3) {
    await db.query("UPDATE parcel SET status = $1 WHERE parcel_id = $2", [
      "received and delivered successfully",
      parcel_id,
    ]);
    await db.query("update parcel set status_no = 4 where parcel_id =$1", [
      parcel_id,
    ]);
    res.status(200).json({
      message: `Status of Parcel with parcel id ${parcel_id} has been updated `,
    });

    res.end();
  } else {
    res.status(400).json({ message: "parcel is missing" });
  }
};

export const id_finder = async (req, res) => {
  //const { id }=req.params;
  const { id } = req.body;
  post_office = await db.query(
    "select * from post_office where post_office_id = $1",
    [id]
  );
  res.status(200).json({
    message: "Fetch Succesfull",
    data: { ...post_office.rows[0] },
  });
};
export const main_finder = async (req, res) => {
  // const { id }=req.params;
  const { id } = req.body;
  post_office = await db.query(
    "select * from post_office where main_post = $1",
    [id]
  );
  //  res.json("sd");
  let rowc = post_office.rowCount;
  res
    .status(200)
    .json({
      title: "Fetch Succesfull ",
      message:
        "There are " + rowc + " sub_post stations with  main_post : " + id,
      data: { ...post_office.rows },
    });
};
export const sub_finder = async (req, res) => {
  // const { id }=req.params;
  const { id } = req.body;
  post_office = await db.query(
    "select * from post_office where sub_post = $1",
    [id]
  );
  let rowc = post_office.rowCount;
  res.status(200).json({
    title: "Fetch Succesfull ",
    //  message: "There are "+rowc+" sub_post stations with  main_post : "+id,
    data: { ...post_office.rows },
  });
};
export const pincode_finder = async (req, res) => {
  // const { id }=req.params;
  const { id } = req.body;
  post_office = await db.query("select * from post_office where pincode = $1", [
    id,
  ]);
  let rowc = post_office.rowCount;
  res
    .status(200)
    .json({ title: "Fetch Succesfull ", data: { ...post_office.rows } });
};


export const id_finder = async (req, res) => {
  //const { id }=req.params;
  const { id } = req.body;
  post_office = await db.query(
    "select * from post_office where post_office_id = $1",
    [id]
  );
  res.status(200).json({
    message: "Fetch Succesfull",
    data: { ...post_office.rows[0] },
  });
};
export const main_finder = async (req, res) => {
  // const { id }=req.params;
  const { id } = req.body;
  post_office = await db.query(
    "select * from post_office where main_post = $1",
    [id]
  );
  //  res.json("sd");
  let rowc = post_office.rowCount;
  res.status(200).json({
    title: "Fetch Succesfull ",
    message: "There are " + rowc + " sub_post stations with  main_post : " + id,
    data: { ...post_office.rows },
  });
};
export const sub_finder = async (req, res) => {
  // const { id }=req.params;
  const { id } = req.body;
  post_office = await db.query(
    "select * from post_office where sub_post = $1",
    [id]
  );
  let rowc = post_office.rowCount;
  res.status(200).json({
    title: "Fetch Succesfull ",
    //  message: "There are "+rowc+" sub_post stations with  main_post : "+id,
    data: { ...post_office.rows },
  });
};
export const pincode_finder = async (req, res) => {
  // const { id }=req.params;
  const { id } = req.body;
  post_office = await db.query("select * from post_office where pincode = $1", [
    id,
  ]);
  let rowc = post_office.rowCount;
  res
    .status(200)
    .json({ title: "Fetch Succesfull ", data: { ...post_office.rows } });
};

export const any_finder = async (req, res) => {
  const { key, value } = req.body;

  console.log(req.body);
  // console.log(value);
  // const query = `SELECT * FROM post_office WHERE $1 = $2`;
  //    const values = [key, value];
  // if (key === 'hub_name')
  // {
  //   const ans = await db.query("select hub_name from connector natural join hub where hub_name = $1", [value]);
  //   // console.log(ans);
  //   const  hub_name  = ans.rows[0].hub_name;
  //   console.log(hub_name);
  //   }
  if (key === "hub_name") {
  
    const aaa = await db.query("select hub_id from hub where hub_name ilike $1", [value]);
    const { hub_id } = aaa.rows[0];
    const bbb = await db.query("select * from connector natural join post_office where hub_id=$1", [hub_id]);
   // console.log(bbb.rows);
    const ans = { ...bbb.rows, value };
// const rowc=

 res.status(200).json({
        message: `Fetch Succesfull  Found ${bbb.rowCount} post offices under the hub ${value}`,
        data: ans,
      });


  }
  else {
    const query = `SELECT * FROM post_office natural join connector  WHERE ${key} = '${value}'`;

    const post_office1 = await db.query(query);
    const { hub_id, ...postOfficeData } = post_office1.rows[0];

    // const { hid } = post_office1.rows[0];
    // console.log(post_office_1id);
    const hname = await db.query("select hub_name from hub where hub_id =$1", [hub_id])
    const { hub_name } = hname.rows[0];
    const ans = {
      ...postOfficeData,
      hub_name,
    };
    // console.log(post_office1.rows);
    // const post_office1 = await db.query(query, values);

    // post_office=await db.query("select * from post_office where $1 = 627412 ",[key]);

    //  post_office=await db.query("select * from post_office where pincode = $1 ",[value]);
    //  post_office=await db.query("select * from post_office where $2 = $1 ",[value,key]);

    // post_office=await db.query("select * from post_office where pincode = 627412");

    // console.log(post_office1.rows);

    //console.log(post_office);
    if (key === "main_post") {
      let rowc = post_office1.rowCount;
      res.status(200).json({
        title: "Fetch Succesfull",
        message:
          "There are " + rowc + " sub_post stations with  main_post : " + value,
        data: ans,
      });
    } else {
      res.status(200).json({
        message: "Fetch Succesfull",
        data: ans,
      });
    }

  }
};
