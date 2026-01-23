const express = require("express");
const router = express.Router();
const { sendMail } = require("../mail/sendMail");
const logger = require("../utils/logger");

router.post("/", async (req, res, next) => {
  // #swagger.tags = ['Emails']
  // #swagger.summary = 'Send transactional email'
  // #swagger.description = 'Sends a transactional email. All requests and errors are logged using Pino.'

  /* #swagger.requestBody = {
        required: true,
        content: {
          "application/json": {
            schema: {
              $ref: "#/definitions/Email"
            }
          }
        }
  } */

  /* #swagger.responses[200] = {
        description: 'Email sent successfully',
        content: {
          "application/json": {
            schema: { $ref: "#/definitions/SuccessResponse" }
          }
        }
  } */

  /* #swagger.responses[400] = {
        description: 'Bad Request – missing or invalid parameters',
        content: {
          "application/json": {
            schema: { $ref: "#/definitions/ErrorResponse" }
          }
        }
  } */

  /* #swagger.responses[500] = {
        description: 'Internal Server Error',
        content: {
          "application/json": {
            schema: { $ref: "#/definitions/ErrorResponse" }
          }
        }
  } */

  try {
    const { to, subject, message } = req.body;

    if (!to || !subject || !message) {
      logger.warn("Invalid email payload", { to, subject });
      return res.status(400).json({
        error: "to, subject and message are required",
      });
    }

    await sendMail({ to, subject, message });

    logger.info("Email sent via API", { to });
    res.status(200).json({ status: "Email sent" });
  } catch (err) {
    logger.error(err, "Failed to send email");
    next(err);
  }
});

module.exports = router;
