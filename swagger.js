const swaggerAutogen = require("swagger-autogen")();

const doc = {
  info: {
    title: "Retail Tractors - Email Service",
    description:
      "Email microservice API. This service also consumes email events asynchronously via RabbitMQ.",
    version: "1.0.0",
  },
  host: "localhost:3000",
  schemes: ["http"],
  tags: [
    {
      name: "Emails",
      description: "Transactional email operations",
    },
  ],
  definitions: {
    Email: {
      required: ["to", "subject", "message"],
      to: "user@email.com",
      subject: "Confirmação de reserva",
      message: "A sua reserva foi confirmada",
    },
    SuccessResponse: {
      status: "Email sent",
    },
    ErrorResponse: {
      error: "Invalid email payload"
    },
  },
};

const outputFile = "./swagger-output.json";
const endpointsFiles = ["./src/app.js"];

swaggerAutogen(outputFile, endpointsFiles, doc);
