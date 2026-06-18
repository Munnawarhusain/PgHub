import express from "express";
import { Router } from "express";
import {
  createAdmin,
  getParticularAdmin,
  signInAdmin,
} from "../controllers/adminApi.js";
import { createPg, editParticularPg, getAllPgs, getParticularPg, getPgById } from "../controllers/pgApi.js";
import { jwt_auth } from "../middleware/jwt_auth.js";
import { createUser, signInUser } from "../controllers/userApi.js";

export const router = Router();

router.post("/createAdmin", createAdmin);
router.post("/signInAdmin", signInAdmin);
router.get(`/getParticularAdmin/:id`, jwt_auth, getParticularAdmin);
router.put(`/editParticularPg/:pgId`, editParticularPg);
router.get("/getAllPgs", getAllPgs);
router.post("/createPg/:id", jwt_auth, createPg);
router.get("/getParticularPg/:id", getParticularPg);
router.post("/createUser", createUser);
router.post("/signInUser", signInUser);
// In your routes file
router.get("/getPgById/:pgId", getPgById);