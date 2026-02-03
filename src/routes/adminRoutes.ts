import express from "express";
import { approveRegistration, getAllRegistrations, rejectRegistration } from "../controllers/adminController";
const router = express.Router();

// GET /api/admin/registrations
router.get("/registrations", getAllRegistrations);
router.patch("/registrations/:id/approve", approveRegistration);
router.patch("/registrations/:id/reject", rejectRegistration);
export default router;
