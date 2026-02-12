import express from "express";
import {  getAllRegistrations, getRegistrationById } from "../controllers/adminController";
import { protect } from "../middleware/auth";
import { createAdmin, createSuperAdmin, login } from "../controllers/authController";
const router = express.Router();


// Login route
router.post("/auth/login", login);


// Register route
router.post("/auth/sregister", createSuperAdmin);

router.post("/auth/register", createAdmin);


// Get summary of all registrations
router.get("/registrations",   getAllRegistrations);

// Get full details of a single registration
router.get("/registrations/:id",  getRegistrationById);
export default router;
