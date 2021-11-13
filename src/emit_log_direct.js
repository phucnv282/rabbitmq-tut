const amqp = require("amqplib/callback_api");

amqp.connect("amqp://root:j@localhost", (error, connection) => {
  if (error) {
    throw error;
  }

  connection.createChannel((error, channel) => {
    if (error) {
      throw error;
    }

    let exchange = "direct_logs";
    let args = process.argv.slice(2);
    let msg = process.argv.slice(2).join(" ") || "Hello world";
    let severity = args.length > 0 ? args[0] : "info";

    channel.assertExchange(exchange, "direct", {
      durable: false,
    });

    channel.publish(exchange, severity, Buffer.from(msg));

    console.log(` [x] Sent ${msg}`);
  });

  setTimeout(() => {
    connection.close();
  }, 500);
});
