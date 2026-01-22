const transporter = require("./transporter");
const logger = require("../utils/logger");

async function sendMail({ to, subject, message }) {
  if (!to || !subject || !message) {
    throw new Error("to, subject and message are required");
  }

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to,
    subject,
    text: message,
  });

  logger.info("Email sent", { to, subject });
}

module.exports = { sendMail };
