import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { db } from "../Database/dbConnect.js";

const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET_KEY,
    {
      expiresIn: "10d",
    }
  );
};

export const register = async (req, res) => {
  const { name, email, password, phone_no, address, type } = req.body;

  try {
    let user = await db.query("SELECT * FROM account WHERE username = $1", [
      email,
    ]);

    let detail = user.rowCount;

    let count = await db.query("SELECT count(*) FROM account GROUP BY id");

    let count1 = count.rowCount;

    if (detail) {
      return res.status(400).json({ message: "User is already present" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);

    db.query(
      "insert into customer(customer_id , name , phone_no , address) values($1, $2, $3, $4)",
      [count1 + 1, name, phone_no, address]
    );

    db.query(
      "INSERT INTO account(username, password, type, id) VALUES ($1, $2,$3, $4)",
      [email, hashPassword, type, count1 + 1]
    )
      .then(() => {
        return res
          .status(201)
          .json({ success: true, message: "User created successfully!" });
      })
      .catch((error) => {
        return res.status(401).json({ success: false, message: error.message });
      });
  } catch (err) {
    res.status(500).json({
      sucess: false,
      message: "internal server error , try again",
      error: `${err}`,
    });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  // console.log("hiii-------------------------------");

  let user = null;

  try {
    user = await db.query("select * from account where username=$1", [email]);

    let type = user.rows[0].type;
    console.log(type);
    if (!user.rowCount) {
      return res.status(404).json({ message: "User Not Found" });
    }

    let isPasswordMatch;
    if (type != "admin" && type != "postoffice" && type != "hubofficer") {
      isPasswordMatch = await bcrypt.compare(password, user.rows[0].password);
      // console.log("hiiiiiii");
    } else {
      isPasswordMatch = password === user.rows[0].password ? true : false;
      // console.log(isPasswordMatch , "hii");
    }
    // console.log(isPasswordMatch , "hii");

    if (!isPasswordMatch) {
      return res.status(400).json({ message: "password doesn't match" });
    }

    const token = generateToken(user);

    res.status(200).json({
      message: "Sucessfully login",
      token,
      data: { ...user.rows[0] },
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to Login" });
  }
};
