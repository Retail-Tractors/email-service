const transporter = require("./transporter");
const logger = require("../utils/logger");

const sendMail = async ({ to, subject, message }) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject,
    text: message,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    logger.info(`Email sent to ${to} (messageId=${info.messageId})`);
    return info;
  } catch (err) {
    logger.error(`Failed to send email to ${to}: ${err.message}`);
    throw err;
  }
};

module.exports = { sendMail };
