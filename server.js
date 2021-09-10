import dotenv from "dotenv";
dotenv.config();
import express from "express";
import Cors from "cors";
import mongoose from "mongoose";
// import Products, { userSchema } from "./dbModel.js";

import productsRouter from "./routes/products.js";
import authRouter from "./routes/auth.js";
import userOrderRouter from "./routes/userOrder.js";
// app config
const app = express();
const port = process.env.PORT || 8001;

// middlwares
app.use(Cors());
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});
app.use(express.json());
app.use("/products", productsRouter);

app.use("/userorder", userOrderRouter);

app.use("/api/auth", authRouter);

// DB config
const dbUrlConnection = process.env.DATABASE_URL;
mongoose.connect(dbUrlConnection, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
  useFindAndModify: true,
});
const db = mongoose.connection;
db.once("open", () => {
  console.log("DB connected");
  // const msgCollection = db.collection("messagecontents");
});
// api endpoints
app.get("/", (req, res) => {
  res.status(200).send("Hello!");
});
app.listen(port, () => {
  console.log("I'm on port", port);
});
