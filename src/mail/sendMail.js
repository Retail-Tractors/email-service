const transporter = require("./transporter");
const logger = require("../utils/logger");

module.exports = async ({ to, subject, message }) => {
  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to,
    subject,
    text: message,
  });

  logger.info(`Email sent to ${to}`);
};
