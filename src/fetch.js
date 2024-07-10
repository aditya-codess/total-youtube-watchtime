const low = require('lowdb');
const _ = require('lodash');
const FileSync = require('lowdb/adapters/FileSync');
const axios = require('axios').default;
const { isRemoved } = require('./helpers');

const adapter = new FileSync('db.json');
const db = low(adapter);

// Set some defaults (required if your JSON file is empty)
db.defaults({ durations: [], notFound: [] }).write();
db.read();

const parseId = (example) => {
  if (!example.titleUrl) {
    console.error('bad example', example);
  }
  return example.titleUrl.split('\u003d').pop();
};
async function fetchBatch(ids) {
  // https://developers.google.com/youtube/v3/docs/videos/list

  const idsGetParam = encodeURIComponent(ids.join(','));
  const apiKey = process.env.API_KEY;

  console.log(ids);
  const response = await axios.get(
    `https://content.googleapis.com/youtube/v3/videos?id=${idsGetParam}&part=contentDetails&key=${apiKey}`,
  );
  const items = response.data.items;
  const notFound = _.difference(
    ids,
    items.map((i) => i.id),
  );
  notFound.forEach((id) => db.get('notFound').push({ id }).write());
  items.forEach((item) =>
    db
      .get('durations')
      .push({ id: item.id, duration: item.contentDetails.duration })
      .write(),
  );
}

const history = require('../watch-history.json');

const live = history.filter((e) => !isRemoved(e));

const allIds = live.map((e) => parseId(e));
const unique = _.uniq(allIds);

const onlyMissing = unique.filter(
  (id) =>
    !db.get('durations').find({ id }).value() &&
    !db.get('notFound').find({ id }).value(),
);

console.log(history.length, live.length, unique.length, onlyMissing.length);

if (!onlyMissing.length) {
  console.log('all is fetched');
  process.exit(0);
}

async function fetchAll(ids) {
  const chunks = _.chunk(ids, 50);
  for (const ch of chunks) {
    await fetchBatch(ch);
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
}

fetchAll(onlyMissing)
  .then(() => console.log('done'))
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
