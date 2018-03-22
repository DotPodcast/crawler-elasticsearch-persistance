## Persist to Elasticsearch

This is one component of the scraping architecture. For an overview of
the entire crawler, see [dotpodcast-crawler](https://github.com/DotPodcast/dotpodcast-crawler)

Currently, this component:

1. Takes the index, type, and source document off of a Rabbit queue
1. Index that source into Elasticsearch

### Setup
Install app dependencies with:
```
yarn
```

or
```
npm install
```

Then, make sure you have RabbitMQ and Elasticsearch instances available.
Since multiple parts of this scraping system rely on RabbitMQ, I'd
recommend spinning one up and pointing all projects to it. The
`docker-compose.yml` with RabbitMQ and Elasticsearch we use to run the
crawler locally can be found in the [dotpodcast-crawler](https://github.com/DotPodcast/dotpodcast-crawler)
repository.

If you already have one running, ensure that the
rabbit host/exchange and Elasticsearch host are configured properly in `config.json`.

Run the app with:
```
yarn run dev
```
or
```
npm run dev
```
