import { Request, Response } from "express";
import Registration from "../models/Registration";

export const getAllRegistrations = async (req: Request, res: Response) => {
  try {
    const registrations = await Registration.find().lean();
    res.status(200).json({ success: true, data: registrations });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// approve a registration
export const approveRegistration = async (req: Request, res: Response) => {
  try {
    const approvedCount = await Registration.countDocuments({
      status: "approved",
    });
    if (approvedCount >= 8) {
      return res
        .status(400)
        .json({ success: false, message: "Max 8 approvals reached" });
    }

    const registration = await Registration.findByIdAndUpdate(
      req.params.id,
      { status: "approved" },
      { new: true }
    );

    if (!registration)
      return res
        .status(404)
        .json({ success: false, message: "Registration not found" });

    res.status(200).json({ success: true, data: registration });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// reject a registration
export const rejectRegistration = async (req: Request, res: Response) => {
  try {
    const registration = await Registration.findByIdAndUpdate(
      req.params.id,
      { status: "rejected" },
      { new: true }
    );

    if (!registration)
      return res
        .status(404)
        .json({ success: false, message: "Registration not found" });

    res.status(200).json({ success: true, data: registration });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};
