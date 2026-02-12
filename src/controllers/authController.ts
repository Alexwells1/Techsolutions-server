import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import Admin from "../models/admin";

const JWT_SECRET = process.env.JWT_SECRET || "secretkey";
const JWT_EXPIRES_IN = "1d";

// Login
export const login = async (req: Request, res: Response) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res
      .status(400)
      .json({ message: "Username and password are required" });
  }

  const admin = await Admin.findOne({ username });
  if (!admin) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const isMatch = await admin.comparePassword(password);
  if (!isMatch) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const token = jwt.sign(
    { id: admin._id, role: admin.role, username: admin.username },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );

  res.json({ token, role: admin.role, username: admin.username });
};


export const createSuperAdmin = async (req: Request, res: Response) => {
  const { username, password } = req.body;
  const exists = await Admin.findOne({ username });
  if (exists)
    return res.status(400).json({ message: "Username already exists" });

  const superAdmin = await Admin.create({
    username,
    password,
    role: "superadmin",
  });
  res
    .status(201)
    .json({ message: "Super admin created", username: superAdmin.username });
};


export const createAdmin = async (req: Request, res: Response) => {
  const { username, password } = req.body;
  const exists = await Admin.findOne({ username });
  if (exists)
    return res.status(400).json({ message: "Username already exists" });

  const admin = await Admin.create({
    username,
    password,
    role: "admin",
  });
  res
    .status(201)
    .json({ message: "admin created", username: admin.username });
};


