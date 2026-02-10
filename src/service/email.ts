import { Resend } from "resend";
import { randomUUID } from "crypto";
import dotenv from "dotenv";
import { ITeamMember } from "../models/Registration";
dotenv.config();

interface SendRegistrationEmailArgs {
  teamName: string;
  emails: string[];
  projectTitle: string;
  teamMembers: ITeamMember[];
  organiserName?: string;
  eventName?: string;
  eventStart?: string;
  eventEnd?: string;
  timezone?: string;
}

function toICSDate(tsISO: string) {
  const d = new Date(tsISO);
  const pad = (n: number) => String(n).padStart(2, "0");
  return (
    d.getFullYear().toString() +
    pad(d.getMonth() + 1) +
    pad(d.getDate()) +
    "T" +
    pad(d.getHours()) +
    pad(d.getMinutes()) +
    pad(d.getSeconds())
  );
}

function toUTCISOStringNoMs(tsISO: string) {
  return new Date(tsISO).toISOString().replace(/[-.:]/g, "").slice(0, 15) + "Z";
}

export async function sendRegistrationEmail({
  teamName,
  emails,
  projectTitle,
  teamMembers,
  organiserName = "Ifeoluwa Emmanuel Omowunmi",
  eventName = "FUNAAB TECHSolutions 2026 Hackathon",
  eventStart = "2026-03-04T15:00:00",
  eventEnd = "2026-03-28T14:00:00",
  timezone = "Africa/Lagos",
}: SendRegistrationEmailArgs) {
  if (!process.env.RESEND_API_KEY) {
    console.error("❌ RESEND_API_KEY is missing");
    throw new Error("RESEND_API_KEY not found in environment");
  }

  const resend = new Resend(process.env.RESEND_API_KEY);
  const uid = `${randomUUID()}@funaab.tech`;
  const dtstamp = toUTCISOStringNoMs(new Date().toISOString());
  const dtstart = toICSDate(eventStart);
  const dtend = toICSDate(eventEnd);

  const ics = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    `PRODID:-//FUNAAB TECHSolutions//EN`,
    `CALSCALE:GREGORIAN`,
    `METHOD:REQUEST`,
    "BEGIN:VEVENT",
    `UID:${uid}`,
    `DTSTAMP:${dtstamp}`,
    `DTSTART;TZID=${timezone}:${dtstart}`,
    `DTEND;TZID=${timezone}:${dtend}`,
    `SUMMARY:${eventName}`,
    `LOCATION:FUNAAB campus and virtual sessions`,
    `DESCRIPTION:Team: ${teamName}\\nProject: ${projectTitle}\\nOrganiser: ${organiserName}\\nSee email for full schedule and links.`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");

  const gStart = toUTCISOStringNoMs(eventStart);
  const gEnd = toUTCISOStringNoMs(eventEnd);
  const gcalBase =
    "https://calendar.google.com/calendar/render?action=TEMPLATE";
  const gcalParams = new URLSearchParams({
    text: eventName,
    dates: `${gStart}/${gEnd}`,
    details: `Team: ${teamName}%0AProject: ${projectTitle}%0AOrganiser: ${organiserName}`,
    location: "FUNAAB campus and virtual sessions",
    sf: "true",
    output: "xml",
  });
  const gcalUrl = `${gcalBase}&${gcalParams.toString()}`;

  const html = `
<div
  style="
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
    color: #000000;
    line-height: 1.8;
    max-width: 680px;
    margin: 0 auto;
    padding: 0;
    background-color: #ffffff;
  "
>
  <!-- Header -->
  <div style="padding: 40px 30px; text-align: center;">
    <h2 style="margin: 0 0 12px 0; font-size: 32px; font-weight: 500; color: #444444;">
      You have registered for
    </h2>
    <h2 style="margin: 0 0 12px 0; font-size: 32px; font-weight: 600; color: #000000;">
      ${eventName}
    </h2>

    <div style="width: 60px; height: 2px; background-color: #ccc; margin: 16px auto;"></div>

    <div style="font-size: 18px; margin-bottom: 6px; color: #444444;">
      📅 Start Date: ${new Date(eventStart).toLocaleDateString("en-US", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
        timeZone: timezone,
      })}
    </div>
    <div style="font-size: 18px; margin-bottom: 12px; color: #444444;">
      📅 End Date: ${new Date(eventEnd).toLocaleDateString("en-US", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
        timeZone: timezone,
      })}
    </div>

    <div style="font-size: 18px; color: #333333;">📍 FUNAAB Campus</div>
  </div>

  <!-- Main Content -->
  <div style="padding: 40px 20px;">
    <!-- Overview -->
    <div style="margin-bottom: 40px;">
      <h3 style="margin: 0 0 12px 0; font-size: 26px; font-weight: 500;">Overview of the Event</h3>
      <p style="margin: 0 0 16px 0; font-size: 18px; line-height: 2; color: #444444;">
        FUNAAB TECHSolutions 2026 is a structured hackathon focused on developing innovative solutions to real-life challenges under the theme “Smart Solutions for a Fast-Moving World.” The program includes team-based ideation, product design and development, prototyping sprints, mentorship from industry professionals, project demonstrations, judging, and awards. Outstanding teams will receive mentorship and incubation opportunities.
      </p>

      <h3 style="margin: 0 0 12px 0; font-size: 26px; font-weight: 500;">Program Structure & Format</h3>
      <p style="margin: 0 0 16px 0; font-size: 18px; line-height: 2; color: #444444;">
        The hackathon adopts a hybrid format to ensure minimal disruption to academic activities.
      </p>
      <ul style="margin: 0 0 16px 24px; font-size: 20px; line-height: 2; color: #444444;">
        <li><strong>Weekly (4 weeks):</strong> One physical session on campus every Wednesday (3:00–5:00 pm) and one virtual session every Friday (4:00–7:00 pm)</li>
        <li><strong>Grand Finale:</strong> Physical event on campus on Saturday (10:00 am–2:00 pm) featuring live demos, judging, award presentations, and a closing ceremony</li>
      </ul>
    </div>

    <!-- Registration Details -->
  <!-- Registration Details -->
<div style="padding: 30px 20px; margin-bottom: 40px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;">
  <h2 style="margin: 0 0 24px 0; font-size: 30px; font-weight: 600; color: #000000;">Registration Details</h2>

  <!-- Team Name -->
  <div style="margin-bottom: 16px;">
    <div style="font-weight: 600; font-size: 20px; color: #333333; margin-bottom: 4px;">Team Name</div>
    <div style="font-size: 18px; color: #000000;">${teamName}</div>
  </div>

  <!-- Project Title -->
  <div style="margin-bottom: 24px;">
    <div style="font-weight: 600; font-size: 20px; color: #333333; margin-bottom: 4px;">Project Title</div>
    <div style="font-size: 18px; color: #000000;">${projectTitle}</div>
  </div>

  <!-- Team Members -->
  <div style="margin-top: 20px;">
    <div style="font-weight: 600; font-size: 20px; margin-bottom: 12px; color: #000000;">Team Members</div>
    <ul style="margin: 0; padding-left: 28px; font-size: 18px; line-height: 2; color: #444444;">
      ${teamMembers.map((member) => `<li>${member.name}</li>`).join("")}
    </ul>
  </div>
</div>


 <!-- Event Structure -->
<section style="margin-bottom: 40px; padding: 0 10px;">
  <h3 style="margin: 0 0 24px 0; font-size: 26px; font-weight: 500; color: #000000;">Event Structure</h3>

  <!-- Week 1 -->
  <article style="margin-bottom: 24px;">
    <h4 style="margin: 0 0 8px 0; font-size: 22px; font-weight: 600; color: #000000;">Week 1: Ideation & Team Formation</h4>
    <p style="margin: 0; font-size: 20px; line-height: 1.8; color: #444444;">
      Teams form and define a clear problem statement.
    </p>
  </article>

  <!-- Week 2 -->
  <article style="margin-bottom: 24px;">
    <h4 style="margin: 0 0 8px 0; font-size: 22px; font-weight: 600; color: #000000;">Week 2: Design & Prototype</h4>
    <p style="margin: 0; font-size: 20px; line-height: 1.8; color: #444444;">
      Create wireframes and testable MVPs.
    </p>
  </article>

  <!-- Week 3 -->
  <article style="margin-bottom: 24px;">
    <h4 style="margin: 0 0 8px 0; font-size: 22px; font-weight: 600; color: #000000;">Week 3: Development Sprint</h4>
    <p style="margin: 0; font-size: 20px; line-height: 1.8; color: #444444;">
      Code, integrate, and test solutions.
    </p>
  </article>

  <!-- Week 4 -->
  <article style="margin-bottom: 24px;">
    <h4 style="margin: 0 0 8px 0; font-size: 22px; font-weight: 600; color: #000000;">Week 4: Demo Day & Judging</h4>
    <p style="margin: 0; font-size: 20px; line-height: 1.8; color: #444444;">
      Live demos and award ceremony.
    </p>
  </article>
</section>



    <!-- CTA -->
    <div style="text-align: center; margin: 40px 0; padding: 30px 0; border-top: 1px solid #ccc; border-bottom: 1px solid #ccc;">
      <p style="margin: 0 0 20px 0; color: #444444; font-size: 18px;">Add this event to your calendar to stay updated</p>
      <a href="${gcalUrl}" target="_blank" style="display: inline-block; background: #2a4365; color: white; padding: 16px 48px; text-decoration: none; border-radius: 6px; font-weight: 500; font-size: 20px;">Add to Calendar</a>
      <p style="margin: 16px 0 0 0; color: #444444; font-size: 16px;">.ics file is also attached</p>
    </div>

    <!-- Footer -->
    <div style="color: #444444;">
      <div style="margin-bottom: 30px;">
        <h3 style="margin: 0 0 16px 0; font-size: 20px; font-weight: 500;">Questions or Concerns?</h3>
        <p style="margin: 0 0 10px 0; font-size: 18px;">If you have any questions about the event, please contact us:</p>
        <p style="margin: 0 0 10px 0; font-size: 18px;"><strong>Event Organiser</strong><br />${organiserName}</p>
        <p style="margin: 0; font-size: 18px;"><strong>Email</strong><br /><a href="mailto:ife.oluwa1@outlook.com" style="color: #2a4365; text-decoration: none;">ife.oluwa1@outlook.com</a></p>
      </div>
      <div style="text-align: center; padding-top: 30px; border-top: 1px solid #ccc;">
        <p style="margin: 0 0 10px 0; font-size: 18px; font-weight: 500;">We look forward to your participation</p>
        <p style="margin: 0; font-size: 18px;">FUNAAB TECHSolutions Team</p>
      </div>
    </div>
  </div>
</div>
`;

  const attachments = [
    {
      filename: `${eventName.replace(/\s+/g, "_")}.ics`,
      contentType: "text/calendar; charset=utf-8; method=REQUEST",
      content: Buffer.from(ics).toString("base64"),
      encoding: "base64",
    },
  ];

  return resend.emails.send({
    from: process.env.FROM_EMAIL as string,
    to: emails,
    subject: `${eventName} — Registration Confirmed`,
    html,
    attachments,
  });
}
