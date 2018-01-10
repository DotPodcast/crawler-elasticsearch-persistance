import elasticsearch from 'elasticsearch';
import config from './config';

const client = new elasticsearch.Client({
  host: `${config.get('es:host')}:${config.get('es:port')}`,
  log: 'info',
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
