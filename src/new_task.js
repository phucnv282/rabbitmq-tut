const amqp = require("amqplib/callback_api");

amqp.connect("amqp://root:j@localhost", (error, connection) => {
  if (error) {
    throw error;
  }

  connection.createChannel((error, channel) => {
    if (error) {
      throw error;
    }

    let queue = "task_queue";
    let msg = process.argv.slice(2).join(" ") || "Hello world";

    channel.assertQueue(queue, {
      durable: true,
    });

    channel.sendToQueue(queue, Buffer.from(msg), {
      persistent: true,
    });
    console.log(` [x] Sent ${msg}`);
  });

  setTimeout(() => {
    connection.close();
  }, 500);
});
