const { expect } = require('chai');

const aggregate = require('./aggregate');

describe('aggregate', () => {
  it('aggregates all watch time by month', () => {
    const testRecords = [
      {
        time: '2017-10-14T16:35:09.661Z',
        duration: 270,
      },
      {
        time: '2017-10-14T16:30:29.385Z',
        duration: 240,
      },
      {
        time: '2017-09-14T16:29:27.878Z',
        duration: 155,
      },
      {
        time: '2017-09-14T15:26:43.506Z',
        duration: 240,
      },
      {
        time: '2017-09-03T13:13:23.530Z',
        duration: 1800,
      },
      {
        time: '2017-08-14T16:35:09.661Z',
        duration: 560,
      },
      {
        time: '2017-08-14T16:30:29.385Z',
        duration: 68,
      },
      {
        time: '2017-08-14T16:29:27.878Z',
        duration: 155,
      },
      {
        time: '2017-07-14T15:26:43.506Z',
        duration: 196,
      },
      {
        time: '2017-06-03T13:13:23.530Z',
        duration: 1800,
      },
    ];

    const result = aggregate(testRecords);

    expect(result.labels).to.eql([
      '2017-06',
      '2017-07',
      '2017-08',
      '2017-09',
      '2017-10',
    ]);
    expect(result.hours).to.eql([
      0.5,
      196 / 3600,
      783 / 3600,
      2195 / 3600,
      510 / 3600,
    ]);
  });
});
