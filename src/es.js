import elasticsearch from 'elasticsearch';
import config from './config';

const client = new elasticsearch.Client({
  host: [
    {
      host: config.get('es:host'),
      port: config.get('es:port'),
      log: 'info',
      protocol: config.get('es:protocol'),
      auth: `${config.get('es:username')}:${config.get('es:password')}`,
    }
  ]
});

const save = (index, type, id, body) => {
  return client.index({
    index,
    type,
    id,
    body,
  });
};

module.exports = save;
