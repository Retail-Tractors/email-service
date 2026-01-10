const amqp = require("amqplib");
const sendMail = require("../mail/sendMail");
const logger = require("../utils/logger");

const RABBIT_URL = "amqp://rabbitmq";
const QUEUE = "email_queue";

async function startEmailConsumer() {
  try {
    const connection = await amqp.connect(RABBIT_URL);
    const channel = await connection.createChannel();

    await channel.assertQueue(QUEUE, { durable: true });

    logger.info(`Waiting for messages on queue: ${QUEUE}`);

    channel.consume(QUEUE, async (msg) => {
      if (!msg) return;

      try {
        const data = JSON.parse(msg.content.toString());

        await sendMail({
          to: data.to,
          subject: data.subject,
          message: data.message,
        });

        channel.ack(msg);
        logger.info(`Email sent to ${data.to}`);
      } catch (err) {
        logger.error("Failed to process message", err);
        channel.nack(msg, false, false);
      }
    });
  } catch (err) {
    logger.error("RabbitMQ consumer failed", err);
  }
}

module.exports = { startEmailConsumer };
