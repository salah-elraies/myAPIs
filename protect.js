import jwt from "jsonwebtoken";
import { UserMod } from "./dbModel";

const protect = async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }
  if (!token) {
    res.status(401).json({ success: false, err: "unauthorized user" });
    next();
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await UserMod.findById(decoded.id);
    if (!user) {
      res.status(404).json({ success: false, err: "no user was found" });
      next();
    }
    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ success: false, err: "go back please" });
  }
};
export default protect;
