import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendContactEmail = async ({
  name,
  email,
  subject,
  message,
}) => {
  if (!process.env.RESEND_API_KEY) {
    console.warn("RESEND_API_KEY missing — contact email skipped");
    return { skipped: true };
  }

  const { data, error } = await resend.emails.send({
    from: "Portfolio <onboarding@resend.dev>",
    to: process.env.EMAIL_TO,
    replyTo: email,
    subject: `[Portfolio] ${subject || "New Message"}`,
    text: `You received a new message from your portfolio website.

Name: ${name}
Email: ${email}
Subject: ${subject || "-"}

Message:
${message}
`,
    html: `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto">
        <h2>New Portfolio Message</h2>

        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> 
          <a href="mailto:${email}">${email}</a>
        </p>
        <p><strong>Subject:</strong> ${subject || "-"}</p>

        <hr />

        <p style="white-space:pre-line">
          ${message.replace(/\n/g, "<br/>")}
        </p>
      </div>
    `,
  });

  if (error) {
    console.error("Resend email error:", error);
    throw new Error(error.message || "Email sending failed");
  }

  console.log("Email sent successfully:", data.id);

  return {
    skipped: false,
    id: data.id,
  };
};


export const sendHireEmail = async ({
  name,
  email,
  company,
  role,
  openPositions,
  salary,
  notes,
}) => {
  if (!process.env.RESEND_API_KEY) {
    console.warn("RESEND_API_KEY missing — hire email skipped");
    return { skipped: true };
  }

  const { data, error } = await resend.emails.send({
    from: "Portfolio <onboarding@resend.dev>",
    to: process.env.EMAIL_TO,
    replyTo: email,
    subject: `Hiring Opportunity - ${role}${company ? ` @ ${company}` : ""}`,
    text: `New hiring inquiry received.

Name: ${name}
Email: ${email}
Company: ${company || "-"}
Role: ${role}
Open Positions: ${openPositions || "-"}
Salary: ${salary || "-"}

Notes:
${notes || "-"}
`,
    html: `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto">
        <h2>New Hiring Opportunity</h2>

        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Company:</strong> ${company || "-"}</p>
        <p><strong>Role:</strong> ${role}</p>
        <p><strong>Open Positions:</strong> ${openPositions || "-"}</p>
        <p><strong>Salary:</strong> ${salary || "-"}</p>

        ${
          notes
            ? `<hr/><p><strong>Notes:</strong><br/>${notes.replace(/\n/g, "<br/>")}</p>`
            : ""
        }
      </div>
    `,
  });

  if (error) {
    console.error("Resend hire email error:", error);
    throw new Error(error.message || "Email sending failed");
  }

  console.log("Hire email sent successfully:", data.id);

  return {
    skipped: false,
    id: data.id,
  };
};