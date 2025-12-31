const logger = require("../utils/logger.js");

function errorHandler(err, req, res, next) {
  logger.error(err);

  if (err.type === "entity.parse.failed") {
    return res.status(400).json({
      error: "Invalid JSON payload! Check if your body data is a valid JSON.",
    });
  }

  const statusCode = err.statusCode || 500;
  const errorMessage = err.error || err.message || "Internal Server Error";
  return res.status(statusCode).json({ error: errorMessage });
}

module.exports = { errorHandler };
