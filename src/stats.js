const history = require('../watch-history.json');
const process = require('./process');
const { isRemoved } = require('./helpers');
const _ = require('lodash');

const result = process(history);

const totalVideos = result.length;
const totalTimeSeconds = result.reduce(
  (acc, record) => acc + record.duration,
  0,
);
const totalTimeHours = Math.round(totalTimeSeconds / 36) / 100;

console.log(
  `Total videos watched: ${totalVideos}\nTotal hours spent watching: ${totalTimeHours}`,
);

const stillLive = result.filter((r) => r.realDuration).length;

console.log(
  `${stillLive} videos out of ${result.length} is still live (${
    stillLive / (result.length / 100)
  }%)`,
);

const topTenWatched = _(result)
  .filter((e) => !isRemoved(e))
  .groupBy('titleUrl')
  .entries()
  .sortBy((e) => e[1].length)
  .takeRight(10)
  .reverse()
  .map((e) => ({
    title: e[1][0].title,
    url: e[1][0].titleUrl,
    times: e[1].length,
  }))
  .value();

console.log('top 10 watched videos:\n', topTenWatched);
