import { Router } from "express";
import { createRegistration } from "../controllers/registerController";

const router = Router();

// POST /api/register
router.post("/", createRegistration);

export default router;
