const amqp = require("amqplib/callback_api");

amqp.connect("amqp://root:j@localhost", (error, connection) => {
  if (error) {
    throw error;
  }

  connection.createChannel((error, channel) => {
    if (error) {
      throw error;
    }

    let exchange = "topic_logs";
    let args = process.argv.slice(2);
    let key = args.length > 0 ? args[0] : "anonymous.info";
    let msg = args.slice(1).join(" ") || "Hello world";

    channel.assertExchange(exchange, "topic", {
      durable: false,
    });

    channel.publish(exchange, key, Buffer.from(msg));

    console.log(` [x] Sent ${key}:${msg}`);
  });

  setTimeout(() => {
    connection.close();
  }, 500);
});
