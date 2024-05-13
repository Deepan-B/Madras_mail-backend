import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import { db } from "./Database/dbConnect.js";
import dotenv from "dotenv";
import authRoute from "./Router/auth.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT;
const corsOptions = {
  origin: true,
};

app.use(express.json());
app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use("/api/v1/auth", authRoute);

app.get("/", (req, res) => {
  res.send("api is working");
});

db.connect().then(() => {
  console.log("database connected");
});

app.listen(PORT, () => {
  console.log(`Server connected successfully at ${PORT}`);
});
