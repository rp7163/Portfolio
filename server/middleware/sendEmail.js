import nodemailer from "nodemailer";

let cachedTransporter = null;

const getTransporter = () => {
  if (cachedTransporter) return cachedTransporter;

  const { EMAIL_USER, EMAIL_PASS } = process.env;
  if (!EMAIL_USER || !EMAIL_PASS) {
    console.warn(
      "⚠️  EMAIL_USER/EMAIL_PASS not set — contact emails will be skipped (still saved to DB)."
    );
    return null;
  }

  cachedTransporter = nodemailer.createTransport({
    service: "gmail",
    auth: { 
      user: EMAIL_USER, 
      pass: EMAIL_PASS 
    },
    connectionTimeout: 10000,
    socketTimeout: 10000,
  });
  return cachedTransporter;
};

export const sendContactEmail = async ({ name, email, subject, message }) => {
  const transporter = getTransporter();
  if (!transporter) return { skipped: true };

  const to = process.env.EMAIL_TO || process.env.EMAIL_USER;
  const mailOptions = {
    from: `"${name}" <${process.env.EMAIL_USER}>`,
    replyTo: email,
    to,
    subject: `[Portfolio] ${subject}`,
    text: `You received a new message from your portfolio site:

Name:    ${name}
Email:   ${email}
Subject: ${subject}

Message:
${message}
`,
    html: `
      <h2>New portfolio message</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
      <p><strong>Subject:</strong> ${subject}</p>
      <hr/>
      <p style="white-space:pre-line">${message.replace(/\n/g, "<br/>")}</p>
    `,
  };

  await transporter.verify();
  console.log("SMTP ready");
  await transporter.sendMail(mailOptions);
  return { skipped: false };
};

/* New: Hiring opportunity email — prettier template */
export const sendHireEmail = async ({ name, email, company, role, openPositions, salary, notes }) => {
  const transporter = getTransporter();
  if (!transporter) return { skipped: true };

  const to = process.env.EMAIL_TO || process.env.EMAIL_USER;
  await transporter.sendMail({
    from: `"${name}" <${process.env.EMAIL_USER}>`,
    replyTo: email,
    to,
    subject: `💼 Hiring opportunity — ${role}${company ? ` @ ${company}` : ""}`,
    text: `You just received a hiring inquiry from your portfolio!

Recruiter: ${name} <${email}>
Company:   ${company || "—"}
Role:      ${role}
Open Positions: ${openPositions || "—"}
Salary:    ${salary || "Not specified"}

Notes:
${notes || "—"}
`,
    html: `
      <div style="font-family:system-ui,-apple-system,Segoe UI,sans-serif;max-width:560px;margin:auto">
        <h2 style="color:#10b981;margin-bottom:0.25rem">💼 New Hiring Opportunity</h2>
        <p style="color:#666;margin-top:0">Someone wants to hire you from your portfolio site.</p>
        <table cellpadding="8" cellspacing="0" style="width:100%;border-collapse:collapse;margin:1.25rem 0">
          <tr style="background:#f9fafb"><td style="font-weight:600;width:140px">Recruiter</td><td>${name} &lt;<a href="mailto:${email}">${email}</a>&gt;</td></tr>
          <tr><td style="font-weight:600">Company</td><td>${company || "—"}</td></tr>
          <tr style="background:#f9fafb"><td style="font-weight:600">Role</td><td>${role}</td></tr>
          <tr><td style="font-weight:600">Open positions</td><td>${openPositions || "—"}</td></tr>
          <tr style="background:#f9fafb"><td style="font-weight:600">Salary / CTC</td><td>${salary || "Not specified"}</td></tr>
        </table>
        ${notes ? `<h3>Notes</h3><p style="white-space:pre-line;background:#f9fafb;padding:12px;border-radius:8px">${notes.replace(/\n/g, "<br/>")}</p>` : ""}
        <p style="margin-top:1.5rem"><a href="mailto:${email}?subject=Re: ${encodeURIComponent(role)} opportunity" style="display:inline-block;background:#10b981;color:white;padding:10px 20px;border-radius:8px;text-decoration:none;font-weight:600">Reply to ${name.split(" ")[0]}</a></p>
      </div>
    `,
  });
  return { skipped: false };
};
