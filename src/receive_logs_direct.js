const amqp = require("amqplib/callback_api");

let args = process.argv.slice(2);

if (args.length == 0) {
  console.log("Usage: receive_logs_direct.js [info] [warning] [error]");
  process.exit(1);
}

amqp.connect("amqp://root:j@localhost", (error, connection) => {
  if (error) {
    throw error;
  }

  connection.createChannel((error, channel) => {
    if (error) {
      throw error;
    }
    let exchange = "direct_logs";

    channel.assertExchange(exchange, "direct", {
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
        args.forEach((severity) => {
          channel.bindQueue(q.queue, exchange, severity);
        });

        channel.consume(
          q.queue,
          (msg) => {
            console.log(
              ` [x] ${msg.fields.routingKey}: ${msg.content.toString()}`
            );
          },
          {
            noAck: true,
          }
        );
      }
    );
  });
});
