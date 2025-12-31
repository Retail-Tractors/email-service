const amqp = require("amqplib");
const logger = require("../utils/logger");
const sendMail = require("../mail/sendMail");

const RABBIT_URL = "amqp://localhost";
const EXCHANGE = "email.events";
const ROUTING_KEY = "email.send";
const QUEUE = "email_queue";

async function startEmailConsumer() {
  try {
    const connection = await amqp.connect(RABBIT_URL);
    const channel = await connection.createChannel();

    await channel.assertExchange(EXCHANGE, "topic", { durable: true });

    await channel.assertQueue(QUEUE, { durable: true });
    await channel.bindQueue(QUEUE, EXCHANGE, ROUTING_KEY);

    logger.info(`Waiting for messages in queue: ${QUEUE}`);

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
        logger.info(`Email sent to ${data.to} (RabbitMQ)`);
      } catch (err) {
        logger.error(err);
        channel.nack(msg, false, false);
      }
    });
  } catch (err) {
    logger.error("RabbitMQ connection failed", err);
  }
}

module.exports = { startEmailConsumer };
