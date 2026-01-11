const amqp = require("amqplib");
const sendMail = require("../mail/sendMail");
const logger = require("../utils/logger");

const RABBIT_URL = process.env.RABBITMQ_URL || "amqp://rabbitmq:5672";
const QUEUE = "email_queue";

async function startEmailConsumer() {
  while (true) {
    try {
      const connection = await amqp.connect("amqp://rabbitmq:5672");
      const channel = await connection.createChannel();

      await channel.assertExchange(EXCHANGE_NAME, "fanout", { durable: true });
      await channel.assertQueue(QUEUE_NAME, { durable: true });
      await channel.bindQueue(QUEUE_NAME, EXCHANGE_NAME, "");

      logger.info(`Waiting for messages in queue: ${QUEUE_NAME}`);

      channel.consume(QUEUE_NAME, (msg) => {
        if (msg) {
          const event = JSON.parse(msg.content.toString());
          logger.info("Event received", event);
          channel.ack(msg);
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
