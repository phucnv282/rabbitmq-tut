const amqp = require("amqplib/callback_api");

amqp.connect("amqp://root:j@localhost", (error, connection) => {
  if (error) {
    throw error;
  }

  connection.createChannel((error, channel) => {
    if (error) {
      throw error;
    }

    let exchange = 'logs'
    let msg = process.argv.slice(2).join(" ") || "Hello world";

    channel.assertExchange(exchange, 'fanout', {
      durable: false
    })

    channel.publish(exchange, '', Buffer.from(msg))
    
    console.log(` [x] Sent ${msg}`);
  });

  setTimeout(() => {
    connection.close();
  }, 500);
});
