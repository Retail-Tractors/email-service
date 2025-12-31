const express = require("express");
const router = express.Router();
const { sendMail } = require("../mail/sendMail");

router.post("/", async (req, res, next) => {
  try {
    const { to, subject, message } = req.body;

    if (!to || !subject || !message) {
      return res.status(400).json({
        error: "to, subject and message are required",
      });
    }

    await sendMail({ to, subject, message });
    res.json({ status: "Email sent" });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
