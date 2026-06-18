import express from "express";
import admin from "../models/adminModel.js";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

// Admin signUp - 
export const createAdmin = async (req, res) => {
  try {
    const { fullname, email, username, phone_no, password } = req.body;
    if (!fullname || !email || !username || !phone_no || !password) {
      return res
        .status(400)
        .json({ success: false, message: "Enter all data" });
    }

    const existAdmin = await admin.findOne({
      $or: [{ email }, { username },{phone_no}],
    });

    if (existAdmin) {
      return res
        .status(403)
        .json({ success: false, message: "username or email already exists" });
    }

    const hashpass = await bcrypt.hash(password, 10);

    const newAdmin = {
      fullname,
      email,
      username,
      phone_no,
      password: hashpass,
    };

    const newadmin = await admin.create(newAdmin);

    const token = jwt.sign(
      {
        id: newadmin._id,
        username: newadmin.username,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" },
    );
    return res
      .status(201)
      .json({ token, message: "Account created successful", data: newadmin, hasPg: newadmin.hasPg});
  } catch (error) {
    console.log("error in creating admin", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Admin signIn -
export const signInAdmin = async (req, res) => {
  const { username, password } = req.body;
  try {
    const adminData = await admin.findOne({ username });
    if (!adminData) {
      return res.status(404).json({ message: "adminData not found" });
    }
    const isMatch = await bcrypt.compare(password, adminData.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid password" });
    }
    const token = jwt.sign(
      { username: adminData.username, id: adminData._id },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );
    return res
      .status(200)
      .json({ token, message: "signIn successful", data:adminData, adminId: adminData._id });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Get Particular AdminData - 
export const getParticularAdmin = async (req, res) => {
  const { id } = req.params;
  try {
    const adminData = await admin.findById(id);
    res.status(200).json({ success: true, data: adminData });
  } catch (error) {
    console.log(error.message);
  }
};