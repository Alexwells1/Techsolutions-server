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
}


export interface IRegistration extends Document {
  teamName: string;
  members: ITeamMember[];
  project: IProject;
}

const TeamMemberSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  role: { type: String, enum: ["Leader", "Member"], required: true },
});


const ProjectSchema = new Schema({
  title: { type: String, required: true },
  focusArea: { type: String, required: true },
});



const RegistrationSchema: Schema<IRegistration> = new Schema(
  {
    teamName: { type: String, required: true },
    members: { type: [TeamMemberSchema], required: true },
    project: { type: ProjectSchema, required: true },
  },
  { timestamps: true }
);

export default mongoose.model<IRegistration>(
  "Registration",
  RegistrationSchema
);
