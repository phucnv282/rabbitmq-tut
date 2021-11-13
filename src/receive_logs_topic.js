const amqp = require("amqplib/callback_api");

let args = process.argv.slice(2);

if (args.length == 0) {
  console.log("Usage: receive_logs_topic.js <facility>.<severity>");
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
    let exchange = "topic_logs";

    channel.assertExchange(exchange, "topic", {
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
          ` [*] Waiting for logs. To exit press CTRL-C`
        );
        args.forEach((key) => {
          channel.bindQueue(q.queue, exchange, key);
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
