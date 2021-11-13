const amqp = require("amqplib/callback_api");

amqp.connect("amqp://root:j@localhost", (error, connection) => {
  if (error) {
    throw error;
  }

  connection.createChannel((error, channel) => {
    if (error) {
      throw error;
    }

    let queue = "hello";
    let msg = "Hello world";

    channel.assertQueue(queue, {
      durable: false,
    });

    channel.sendToQueue(queue, Buffer.from(msg));
    console.log(` [x] Sent ${msg}`);
  });

  setTimeout(() => {
    connection.close();
  }, 500);
});
