import nodemailer from "nodemailer";

const isEmailConfigured = () =>
  Boolean(
    process.env.SMTP_HOST &&
      process.env.SMTP_PORT &&
      process.env.SMTP_USER &&
      process.env.SMTP_PASS &&
      process.env.EMAIL_FROM,
  );

const createTransporter = () =>
  nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: process.env.SMTP_SECURE === "true",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

export const sendRoommateMatchEmail = async ({ to, firstName, matchCount }) => {
  if (!isEmailConfigured()) {
    console.log(
      `Roommate match email skipped for ${to}: SMTP settings are not configured.`,
    );
    return { skipped: true };
  }

  const plural = matchCount === 1 ? "user" : "users";
  const transporter = createTransporter();

  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to,
    subject: "We found roommate matches for you",
    text: `Hi ${firstName || "there"},

Good news! We found ${matchCount} ${plural} who may be compatible roommate matches for you on UniMate.

Open your UniMate dashboard to review your matches and connect with them.

The UniMate Team`,
    html: `
      <p>Hi ${firstName || "there"},</p>
      <p>Good news! We found <strong>${matchCount}</strong> ${plural} who may be compatible roommate matches for you on UniMate.</p>
      <p>Open your UniMate dashboard to review your matches and connect with them.</p>
      <p>The UniMate Team</p>
    `,
  });

  return { skipped: false };
};

