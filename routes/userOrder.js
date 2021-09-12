import dotenv from "dotenv";
dotenv.config();
import express from "express";
import { userOrders } from "../dbModel.js";
import nodemailer from "nodemailer";
const userOrderRouter = express.Router();

userOrderRouter.post("/", async (req, res) => {
  // res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
  // res.header(
  //   "Access-Control-Allow-Headers",
  //   "Origin, X-Requested-With, Content-Type, Accept"
  // );
  const { user, order, total, phone, address, ordersObj } = req.body;
  try {
    // // sort order
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
    // // end sorting
    // start mail
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "salah.elraies@gmail.com",
        pass: process.env.ORDER_MAIL_PASS,
      },
    });
    // const missing = Object.entries(ordersObj).join(" || ");
    const missing = Object.entries(ordersObj).map((prod) => {
      return `<h3>${prod[1]} of ${prod[0]}</h3>`;
    });
    const orderMessage = `
    <p>You have received a new order from:</p>
    <h3>${user.userName}</h3>
    <span>phone number: </span>
    <h4>${phone}</h4>
    <p>he ordered:</p>
    <div>${missing}</div>
    <p>with the total of <b>${total}L.E.</b></p>
    <p>if he sent an address for the delivery it will be shown below</p>
    <h4>${address}</h4>
  `;
    const mailOptions = {
      from: "salah.elraies@gmail.com",
      to: "s4l47.elraies@gmail.com",
      subject: "New Order from website",
      html: orderMessage,
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
        console.log("heheeheheheheh");
      } else {
        console.log("Email sent: " + info.response);
      }
    });
    // end mail
    // db creation
    await userOrders.create({
      user,
      order,
      total,
    });
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
