const amqp = require("amqplib/callback_api");

amqp.connect("amqp://root:j@localhost", (error, connection) => {
  if (error) {
    throw error;
  }

  connection.createChannel((error, channel) => {
    if (error) {
      throw error
    }
    let queue = "task_queue";

    channel.assertQueue(queue, {
      durable: true,
    });

    channel.prefetch(1);
    console.log(` [*] Waiting for messages is ${queue}. To exit press CTRL-C`);
    channel.consume(
      queue,
      (msg) => {
        const secs = msg.content.toString().split(".").length - 1;

        console.log(` [x] Received ${msg.content.toString()}`);
        setTimeout(() => {
          console.log(` [x] Done`);
        }, secs * 1000);
      },
      {
        noAck: false,
      }
    );
  });
});
