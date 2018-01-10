import winston from 'winston';
import amqplib from 'amqplib';

import config from './config';
import saveToEs from './es';

winston.log('info', 'Up');
winston.log('info', config.get('rabbit'));

const exit = (cb) => {
  try {
    if (cb) {
      cb();
    }
  } catch (err) {
    winston.log('error', 'Could not run cleanup fn');
    winston.log('error', err);
  } finally {
    process.exit(0);
  }
};

const inQ = config.get('rabbit:inQueue');

// Connect to RabbitMQ
const open = amqplib.connect(`amqp://${config.get('rabbit:host')}`);

open.then((conn) => {
  conn.createChannel()
    .then((ch) => {
      ch.prefetch(1);
      ch.assertQueue(inQ, { durable: true });
      winston.log('info', 'Input Queue is Present');

      const work = async (doc, channel, msg) => {
        winston.info(`Persisting ${doc.type} with id of ${doc.id}`);
        saveToEs(doc.index, doc.type, doc.id, doc.source).then((res) => {
          channel.ack(msg);
        }).catch((e) => {
          winston.error(e);
          channel.ack(msg);
        });
      };

      ch.consume(inQ, (msg) => {
        let doc;
        try {
          doc = JSON.parse(msg.content.toString());
        } catch (e) {
          winston.log('error', e);
          return winston.log('error', 'Could not parse message into JSON');
        }
        return work(doc, ch, msg);
      }, { noAck: false });
    });
});

open.catch((err) => {
  winston.log('warn', `Error connecting to rabbit at ${config.get('rabbit_host')}`);
  winston.log('error', err);
  exit();
});

process.on('SIGINT', () => {
  winston.log('info', '\nGracefully shutting down from SIGINT (Ctrl-C)');
  exit();
});
