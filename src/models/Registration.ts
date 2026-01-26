// src/models/Registration.ts
import mongoose, { Schema, Document } from "mongoose";

export interface ITeamMember {
  name: string;
  email: string;
  role: "Leader" | "Member";
}

export interface IProject {
  title: string;
  focusArea: string;
  problem: string;
  solution: string;
  technologies: string;
  features: string[];
}

export interface IDeclarations {
  mouAgreed: boolean;
  publicityConsent: boolean;
  conflict: string;
}

export interface IRegistration extends Document {
  teamName: string;
  institution: string;
  members: ITeamMember[];
  project: IProject;
  declarations: IDeclarations;
  createdAt: Date;
}

const TeamMemberSchema: Schema<ITeamMember> = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  role: { type: String, enum: ["Leader", "Member"], required: true },
});

const ProjectSchema: Schema<IProject> = new Schema({
  title: { type: String, required: true },
  focusArea: { type: String, required: true },
  problem: { type: String, required: true },
  solution: { type: String, required: true },
  technologies: { type: String, required: true },
  features: [{ type: String, required: true }],
});

const DeclarationsSchema: Schema<IDeclarations> = new Schema({
  mouAgreed: { type: Boolean, required: true },
  publicityConsent: { type: Boolean, required: true },
  conflict: { type: String, required: true },
});

const RegistrationSchema: Schema<IRegistration> = new Schema(
  {
    teamName: { type: String, required: true },
    institution: { type: String, required: true },
    members: { type: [TeamMemberSchema], required: true },
    project: { type: ProjectSchema, required: true },
    declarations: { type: DeclarationsSchema, required: true },
  },
  { timestamps: true }
);

export default mongoose.model<IRegistration>(
  "Registration",
  RegistrationSchema
);
