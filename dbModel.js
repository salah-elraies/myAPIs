import crypto from "crypto";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
const al7adeedySchema = mongoose.Schema({
  title: { type: String, required: true },
  price: { type: Number, required: true },
  productImageLink: { type: String, required: true },
  amountNeeded: { type: Number, required: true },
  company: String,
  size: String,
  kind: String,
});

const userSchema = mongoose.Schema({
  userName: {
    type: String,
    required: [true, "please type your name"],
  },
  email: {
    type: String,
    required: [true, "please enter your email"],
    unique: true,
    match: [
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      "please provide a valid email",
    ],
  },
  password: {
    type: String,
    required: [true, "please add a strong password"],
    minlength: 6,
    select: false,
  },
  resetPasswordToken: String,
  resetPasswordExpire: Date,
});
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});
userSchema.methods.checkPasswords = async function (password) {
  return await bcrypt.compare(password, this.password);
};
userSchema.methods.getSignedToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};
userSchema.methods.getResetPasswordToken = function () {
  const resetToken = crypto.randomBytes(20).toString("hex");
  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  this.resetPasswordExpire = Date.now() + 30 * (60 * 1000);
  return resetToken;
};

const userOrderSchema = mongoose.Schema({
  user: Object,
  order: Array,
  total: Number,
});

const UserMod = mongoose.model("users", userSchema);
const userOrders = mongoose.model("userOrders", userOrderSchema);
export { UserMod, userOrders };
export default mongoose.model("product", al7adeedySchema);
