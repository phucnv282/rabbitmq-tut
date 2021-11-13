const amqp = require("amqplib/callback_api");

amqp.connect("amqp://root:j@localhost", (error, connection) => {
  if (error) {
    throw error;
  }

  connection.createChannel((error, channel) => {
    if (error) {
      throw error
    }

    let queue = "hello";

    channel.assertQueue(queue, {
      durable: false,
    });

    console.log(` [*] Waiting for messages is ${queue}. To exit press CTRL-C`);
    channel.consume(
      queue,
      (msg) => {
        console.log(` [x] Received ${msg.content.toString()}`);
      },
      {
        noAck: true,
      }
    );
  });
});
