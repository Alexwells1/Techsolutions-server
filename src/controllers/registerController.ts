import { Request, Response } from "express";
import Registration, { ITeamMember } from "../models/Registration";
import { sendRegistrationEmail } from "../service/email";

export const createRegistration = async (req: Request, res: Response) => {
  console.log("Received registration request");
  try {
    const { teamName, teamLeaderName, teamLeaderEmail, members, project } =
      req.body;

    if (
      !teamName ||
      !teamLeaderName ||
      !teamLeaderEmail ||
      !members ||
      !project
    ) {
      console.log("Registration failed: Missing fields");
      return res.status(400).json({ message: "Missing required fields" });
    }

    const existingTeam = await Registration.findOne({ teamName });
    if (existingTeam) {
      console.log(
        `Registration failed: Team name "${teamName}" already in use`
      );
      return res.status(400).json({ message: "Team name already in use" });
    }

    const existingProject = await Registration.findOne({
      "project.title": project.title,
    });
    if (existingProject) {
      console.log(
        `Registration failed: Project title "${project.title}" already in use`
      );
      return res.status(400).json({ message: "Project title already in use" });
    }

    const focusCount = await Registration.countDocuments({
      "project.focusArea": project.focusArea,
    });
    if (focusCount >= 2) {
      console.log(
        `Registration failed: Focus area "${project.focusArea}" not available`
      );
      return res.status(400).json({ message: "Focus area not available" });
    }

    const leaderMember: ITeamMember = {
      name: teamLeaderName,
      email: teamLeaderEmail,
      role: "Leader",
    };
    const allMembers: ITeamMember[] = [
      leaderMember,
      ...members.map((m: any) => ({
        name: m.name,
        email: m.email,
        role: "Member",
      })),
    ];

    const registration = new Registration({
      teamName,
      members: allMembers,
      project,
    });
    await registration.save();

    console.log(`✅ Team "${teamName}" registered successfully`);
    console.log(
      "Team members:",
      allMembers.map((m) => `${m.name} <${m.email}>`).join(", ")
    );

    const emails = allMembers.map((m) => m.email);

    try {
      console.log(`📧 Sending registration email to: ${emails.join(", ")}`);
      await sendRegistrationEmail({
        teamMembers: allMembers,
        teamName,
        emails,
        projectTitle: project.title,
      });
      console.log("✅ Registration emails sent successfully");
    } catch (emailError) {
      console.error("❌ Email send failed", emailError);
    }

    return res.status(201).json({
      message: "Registration successful",
      registrationId: registration._id,
    });
  } catch (err) {
    console.error("❌ Registration failed", err);
    return res.status(500).json({ message: "Server error" });
  }
};
