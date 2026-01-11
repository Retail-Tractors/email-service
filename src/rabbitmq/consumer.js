const amqp = require("amqplib");
const sendMail = require("../mail/sendMail");
const logger = require("../utils/logger");

const RABBIT_URL = process.env.RABBITMQ_URL || "amqp://rabbitmq:5672";
const QUEUE_NAME = "email_queue";
const RETRY_INTERVAL = 5000;

async function startEmailConsumer() {
  while (true) {
    try {
      const connection = await amqp.connect(RABBIT_URL);
      const channel = await connection.createChannel();

      await channel.assertQueue(QUEUE_NAME, { durable: true });

      logger.info(`Waiting for messages in queue: ${QUEUE_NAME}`);

      channel.consume(QUEUE_NAME, async (msg) => {
        if (!msg) return;

        try {
          const event = JSON.parse(msg.content.toString());
          logger.info("Event received", event);

          await sendMail(event);

          channel.ack(msg);
        } catch (err) {
          logger.error("Error processing email message", err);
          channel.nack(msg, false, false);
        }
      });

      break;
    } catch (err) {
      logger.error("RabbitMQ not ready, retrying...");
      await new Promise((res) => setTimeout(res, RETRY_INTERVAL));
    }
  }
}

module.exports = { startEmailConsumer };
