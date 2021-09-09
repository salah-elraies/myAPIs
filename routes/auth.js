import express from "express";
const authRouter = express.Router();

// Controllers
import {
  login,
  register,
  forgotPassword,
  resetPassword,
} from "../controllers/auth.js";

authRouter.route("/register").post(register);

authRouter.route("/login").post(login);

authRouter.route("/forgotpassword").post(forgotPassword);

authRouter.route("/resetPass/:resetToken").put(resetPassword);

export default authRouter;
