const amqp = require("amqplib/callback_api");

let args = process.argv.slice(2);

if (args.length == 0) {
  console.log(`Usage: rpc_client.js num`);
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

    channel.assertQueue(
      "",
      {
        exclusive: true,
      },
      (error, q) => {
        if (error) {
          throw error;
        }
        let correlationId = generateUuid();
        let num = parseInt(args[0]);

        console.log(` [x] Requesting fib(${num})`);

        channel.consume(
          q.queue,
          (msg) => {
            if (msg.properties.correlationId == correlationId) {
              console.log(` [.] Got ${msg.content.toString()}`);
              setTimeout(() => {
                connection.close();
                process.exit(0);
              }, 500);
            }
          },
          {
            noAck: true,
          }
        );

        channel.sendToQueue("rpc_queue", Buffer.from(num.toString()), {
          correlationId: correlationId,
          replyTo: q.queue,
        });
      }
    );
  });
});

function generateUuid() {
  return (
    Math.random().toString() +
    Math.random().toString() +
    Math.random().toString()
  );
}
