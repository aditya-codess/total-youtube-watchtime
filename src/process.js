const low = require('lowdb');
const moment = require('moment');
const _ = require('lodash');
const FileSync = require('lowdb/adapters/FileSync');

const adapter = new FileSync('db.json');
const localDb = low(adapter);

// Set some defaults (required if your JSON file is empty)
localDb.defaults({ durations: [], notFound: [] }).write();
localDb.read();

const DEFAULT_DURATION = 240;
const MAXIMUM_DURATION = 1800;

const defaultRecord = (title, time, titleUrl) =>
  _.pickBy({
    title,
    titleUrl,
    time,
    duration: DEFAULT_DURATION,
  });

module.exports = (history, db = localDb) => {
  return history.map(({ title, titleUrl, time }) => {
    if (!titleUrl) return defaultRecord(title, time);
    const id = titleUrl.split('\u003d').pop();
    const duration = db.get('durations').find({ id }).value();
    if (!duration) return defaultRecord(title, time, titleUrl);
    const seconds = moment.duration(duration.duration).asSeconds();
    return {
      title,
      titleUrl,
      time,
      duration: Math.min(MAXIMUM_DURATION, seconds),
      realDuration: seconds,
    };
  });
};
