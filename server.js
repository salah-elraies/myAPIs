import dotenv from "dotenv";
dotenv.config();
import Cors from "cors";
import express from "express";
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
