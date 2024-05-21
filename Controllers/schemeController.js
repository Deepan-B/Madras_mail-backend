import { db } from "../Database/dbConnect.js";

export const edit_scheme = async (req, res) => {
  const { scheme_id, scheme_details } = req.body;
  const is_available = await db.query(
    "select * from scheme where scheme_id = $1",
    [scheme_id]
  );
  if (is_available.rowCount === 0)
    return res
      .status(404)
      .json({ message: `No scheme Available with Scheme id : ${scheme_id}` });
  await db.query(
    "update scheme set scheme_details = $1 where scheme_id = $2 ",
    [scheme_details, scheme_id]
  );
  res
    .status(200)
    .json({
      message: `Scheme updated with a scheme id ${scheme_id} , new scheme details  : ${scheme_details}`,
    });
};

export const get_scheme = async (req, res) => {
  const { scheme_id } = req.body;
  const is_available = await db.query(
    "select * from scheme where scheme_id = $1",
    [scheme_id]
  );
  if (is_available.rowCount === 0)
    return res
      .status(404)
      .json({ message: `No scheme Available with Scheme id : ${scheme_id}` });
  res
    .status(200)
    .json({
      message: `Scheme Found with a scheme id ${scheme_id}`,
      data: is_available.rows,
    });
};

export const add_scheme = async (req, res) => {
  const { scheme_details, pdf_link } = req.body;
  try {
    await db.query("insert into scheme (scheme_details) values ($1 , $2)", [
      scheme_details,
      pdf_link,
    ]);
    // const added = await db.query(
    //   "select 1 from scheme where scheme_details ilike $1",
    //   [scheme_details]
    // );
    // res.status(200).json({message:`Scheme added with details `,data:{...added.rows}});
    res.status(200).json({ message: "Scheme added successfully" });
  } catch {
    e;
  }
  {
    res
      .status(500)
      .json({
        message: "Internal server error cannot add schemes at the moment",
      });
  }
};
export const remove_scheme = async (req, res) => {
  const { scheme_id } = req.body;
  const is_available = await db.query(
    "select * from scheme where scheme_id = $1",
    [scheme_id]
  );
  if (is_available.rowCount === 0)
    return res
      .status(404)
      .json({ message: `No scheme Available with Scheme id : ${scheme_id}` });
  await db.query("delete from scheme where scheme_id = $1 ", [scheme_id]);
  res
    .status(200)
    .json({ message: `Scheme deleted with a scheme id ${scheme_id}` });
};

export const list = async (req, res) => {
  try {
    const output = await db.query("select * from scheme");

    if (output.rowCount > 0) {
      return res.status(200).json({
        data: output.rows,
      });
    } else {
      return res.status(404).json({
        message: "There is no scheme available now",
      });
    }
  } catch (err) {
    return res.status(500).json({
      message: "internal server error",
      error: err,
    });
  }
};
