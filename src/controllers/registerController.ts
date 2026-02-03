import { Request, Response } from "express";
import Registration, { ITeamMember } from "../models/Registration";

export const createRegistration = async (req: Request, res: Response) => {
  try {
    const {
      teamName,
      teamLeaderName,
      teamLeaderEmail,
      members,
      project,
    } = req.body;


    if (
      !teamName ||
      !teamLeaderName ||
      !teamLeaderEmail ||
      !members ||
      !project
    ) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Check if team name already exists
    const existingTeam = await Registration.findOne({ teamName });
    if (existingTeam) {
      return res.status(400).json({ message: "Team name already in use" });
    }

    // Check if project title already exists
    const existingProject = await Registration.findOne({
      "project.title": project.title,
    });
    if (existingProject) {
      return res.status(400).json({ message: "Project title already in use" });
    }

    // Check if focus area already chosen by 2 teams
    const focusCount = await Registration.countDocuments({
      "project.focusArea": project.focusArea,
    });
    if (focusCount >= 2) {
      return res
        .status(400)
        .json({ message: "Focus area not available" });
    }

    // Create leader member
    const leaderMember: ITeamMember = {
      name: teamLeaderName,
      email: teamLeaderEmail,
      role: "Leader",
    };

    // Map other members
    const allMembers: ITeamMember[] = [
      leaderMember,
      ...members.map((m: any) => ({ ...m, role: "Member" })),
    ];

    // Create registration document
    const registration = new Registration({
      teamName,
      members: allMembers,
      project,
    });

    await registration.save();

    return res.status(201).json({
      message: "Registration successful",
      registrationId: registration._id,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};
