import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import { db } from "./Database/dbConnect.js";
import dotenv from "dotenv";
import authRoute from "./Router/auth.js";
import post_office from "./Router/post_office.js";
import scheme from "./Router/scheme.js";
import customer_route from "./Router/customer.js";
import feedback from "./Router/feedback.js";
import stamps from "./Router/stamp.js";
import news from "./Router/news.js";
import hub from "./Router/hub.js";

import emailRoute from "./Router/emailRoute.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT;
const corsOptions = {
  origin: true,
};

app.use(express.json());
app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use("/auth", authRoute);

app.use("/send-email", emailRoute);

app.get("/", (req, res) => {
  res.send("api is working");
});

app.use("/stamps", stamps);

app.use("/customer", customer_route);

app.use("/hub", hub);

app.use("/scheme", scheme);

app.use("/news", news);

app.use("/post-office", post_office);

app.use("/feedback", feedback);

// db.end().then(() => {
//   console.log("database disconnected");
// });

// app.get("/list",async(req,res)=>{
//   try {
//       const all = await db.query("select * from account");
//       res.json(all.rows );
//   } catch (err) {
//       console.error(err.message);
//   }
// });
db.connect().then(() => {
  console.log("database connected");
});

app.listen(PORT, () => {
  console.log(`Server connected successfully at ${PORT}`);
});
