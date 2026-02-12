// src/controllers/adminController.ts
import { Request, Response } from "express";
import Registration from "../models/Registration";

// List all registrations with summary info
export const getAllRegistrations = async (req: Request, res: Response) => {
  try {
    console.log("getAllRegistrations");
    const registrations = await Registration.find().lean();

    // Map to summary info
    const summary = registrations.map((r) => ({
      id: r._id,
      teamName: r.teamName,
      project: r.project,
    }));

    res.status(200).json({ success: true, data: summary });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Get full details of a single registration
export const getRegistrationById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const registration = await Registration.findById(id).lean();

    if (!registration) {
      return res
        .status(404)
        .json({ success: false, message: "Registration not found" });
    }

    res.status(200).json({ success: true, data: registration });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
