const _ = require('lodash');
const moment = require('moment');

module.exports = (records) => {
  const recordsByMonth = _.groupBy(records, (r) =>
    moment(r.time).format('YYYY-MM'),
  );
  const hoursWatchedByMonth = _.mapValues(
    recordsByMonth,
    (records) => records.reduce((acc, r) => acc + r.duration, 0) / 3600,
  );
  const sortedMonthEntries = _(hoursWatchedByMonth)
    .entries()
    .sortBy((e) => e[0])
    .value();
  return {
    labels: sortedMonthEntries.map((e) => e[0]),
    hours: sortedMonthEntries.map((e) => e[1]),
  };
};
