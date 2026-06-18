import user from "../models/userModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// user signUp -
export const createUser = async (req, res) => {
  try {
    const { fullname, email, username, phone_no, password } = req.body;
    if (!fullname || !email || !username || !phone_no || !password) {
      return res
        .status(400)
        .json({ success: false, message: "Enter all data" });
    }

    const existUser = await user.findOne({
      $or: [{ email }, { username }, { phone_no }],
    });

    if (existUser) {
      return res
        .status(403)
        .json({ success: false, message: "username or email already exists" });
    }

    const hashpass = await bcrypt.hash(password, 10);

    const newUser = {
      fullname,
      email,
      username,
      phone_no,
      password: hashpass,
    };

    const newuser = await user.create(newUser);

    const token = jwt.sign(
      {
        id: newuser._id,
        username: newuser.username,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" },
    );
    return res
      .status(201)
      .json({
        token,
        message: "Account created successful",
        data: newuser,
      });
  } catch (error) {
    console.log("error in creating admin", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

// user signIn -
export const signInUser = async (req, res) => {
  const { username, password } = req.body;
  try {
    const userData = await user.findOne({ username });
    if (!userData) {
      return res.status(404).json({ message: "userData not found" });
    }
    const isMatch = await bcrypt.compare(password, userData.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid password" });
    }
    const usertoken = jwt.sign(
      { username: userData.username, id: userData._id },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );
    return res
      .status(200)
      .json({ usertoken, message: "signIn successful", data:userData, userId: userData._id });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};