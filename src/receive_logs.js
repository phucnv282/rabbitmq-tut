const amqp = require("amqplib/callback_api");

amqp.connect("amqp://root:j@localhost", (error, connection) => {
  if (error) {
    throw error;
  }

  connection.createChannel((error, channel) => {
    if (error) {
      throw error;
    }
    let exchange = "logs";

    channel.assertExchange(exchange, "fanout", {
      durable: false,
    });

    channel.assertQueue(
      "",
      {
        exclusive: true,
      },
      (error, q) => {
        if (error) {
          throw error;
        }
        console.log(
          ` [*] Waiting for messages is ${q.queue}. To exit press CTRL-C`
        );
        channel.bindQueue(q.queue, exchange, "");

        channel.consume(
          q.queue,
          (msg) => {
            console.log(` [x] Received ${msg.content.toString()}`);
          },
          {
            noAck: true,
          }
        );
      }
    );
  });
});
