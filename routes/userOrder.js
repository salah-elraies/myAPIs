import dotenv from "dotenv";
dotenv.config();
import express from "express";
import { userOrders } from "../dbModel.js";
import nodemailer from "nodemailer";
// import cors from "cors";
const userOrderRouter = express.Router();
// userOrderRouter.use(cors());
userOrderRouter.post("/", async (req, res) => {
  // res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
  // res.header(
  //   "Access-Control-Allow-Headers",
  //   "Origin, X-Requested-With, Content-Type, Accept"
  // );
  const { user, order, total } = req.body;
  try {
    // sort order
    // const sortedBasket = [...order].sort((a, b) => {
    //   return a.title.localeCompare(b.title);
    // });
    // let newArr = [];
    // let objArr = [];
    // let ordersObj = {};
    // newArr.push(sortedBasket[0]);
    // for (let i = 0; i < sortedBasket.length; i++) {
    //   if (
    //     sortedBasket[i - 1] &&
    //     sortedBasket[i].title !== sortedBasket[i - 1].title
    //   ) {
    //     newArr.push(sortedBasket[i]);
    //   }
    // }
    // for (let j = 0; j < newArr.length; j++) {
    //   objArr = sortedBasket.filter((v) => {
    //     if (newArr[j].title) {
    //       if (v.title === newArr[j].title) {
    //         return v;
    //       }
    //     }
    //   });
    //   ordersObj[newArr[j]?.title] = objArr.length;
    // }
    // end sorting
    // db creation
    await userOrders.create(
      {
        user,
        order,
        total,
      },
      (err, data) => {
        if (err) res.status(500).send(err);
        else res.status(201).send(data);
      }
    );
  } catch (err) {
    res.json({ failed: true, error: err });
  }
});

userOrderRouter.get("/", async (req, res) => {
  await userOrders.find((err, data) => {
    if (err) res.status(500).send(err);
    else res.status(200).send(data);
  });
});

export default userOrderRouter;
