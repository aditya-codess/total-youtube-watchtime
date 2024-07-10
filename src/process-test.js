const process = require('./process');
const { expect } = require('chai');

const low = require('lowdb');
const Memory = require('lowdb/adapters/Memory');

describe('process', () => {
  it('processes', () => {
    const examples = [
      {
        header: 'YouTube',
        title: 'Watched House Md - Diagnostic on the air',
        titleUrl: 'https://www.youtube.com/watch?v\u003dHJF92s-AZws',
        subtitles: [
          {
            name: 'fbfraga2',
            url: 'https://www.youtube.com/channel/UCifF-ynU1P-2u-4IGua-zEQ',
          },
        ],
        time: '2017-09-14T16:35:09.661Z',
        products: ['YouTube'],
      },
      {
        header: 'YouTube',
        title: 'Watched https://www.youtube.com/watch?v\u003d-Q2cpVDYqFA',
        titleUrl: 'https://www.youtube.com/watch?v\u003d-Q2cpVDYqFA',
        time: '2017-09-14T16:30:29.385Z',
        products: ['YouTube'],
      },
      {
        header: 'YouTube',
        title: 'Watched House MD - Cuddy\u0027s striptease extended',
        titleUrl: 'https://www.youtube.com/watch?v\u003d8KfQrqob4Xc',
        subtitles: [
          {
            name: 'alaniico09',
            url: 'https://www.youtube.com/channel/UC2Q72VNmB5JuCMoKzd3UF0Q',
          },
        ],
        time: '2017-09-14T16:29:27.878Z',
        products: ['YouTube'],
      },
      {
        header: 'YouTube',
        title: 'Watched a video that has been removed',
        time: '2017-09-14T15:26:43.506Z',
        products: ['YouTube'],
      },
      {
        header: 'YouTube',
        title:
          'Watched WATCH NOW: NASA Earth From Space (HDVR) ♥ ISS LIVE FEED #AstronomyDay2018 | Subscribe now!',
        titleUrl: 'https://www.youtube.com/watch?v\u003dRtU_mdL2vBM',
        subtitles: [
          {
            name: 'SPACE (Official)',
            url: 'https://www.youtube.com/channel/UCIR_LPmEQ9QHR0yB2lxgaxQ',
          },
        ],
        time: '2017-09-03T13:13:23.530Z',
        products: ['YouTube'],
      },
    ];

    const adapter = new Memory(null, {
      defaultValue: {
        durations: [
          {
            id: 'HJF92s-AZws',
            duration: 'PT4M30S',
          },
          {
            id: '8KfQrqob4Xc',
            duration: 'PT2M35S',
          },
          {
            id: 'RtU_mdL2vBM',
            duration: 'P532DT21H51M54S',
          },
        ],
      },
    });
    const db = low(adapter);

    expect(process(examples, db)).to.eql([
      {
        title: 'Watched House Md - Diagnostic on the air',
        titleUrl: 'https://www.youtube.com/watch?v\u003dHJF92s-AZws',
        time: '2017-09-14T16:35:09.661Z',
        duration: 270,
        realDuration: 270,
      },
      {
        title: 'Watched https://www.youtube.com/watch?v\u003d-Q2cpVDYqFA',
        titleUrl: 'https://www.youtube.com/watch?v\u003d-Q2cpVDYqFA',
        time: '2017-09-14T16:30:29.385Z',
        duration: 240,
      },
      {
        title: 'Watched House MD - Cuddy\u0027s striptease extended',
        titleUrl: 'https://www.youtube.com/watch?v\u003d8KfQrqob4Xc',
        time: '2017-09-14T16:29:27.878Z',
        duration: 155,
        realDuration: 155,
      },
      {
        title: 'Watched a video that has been removed',
        time: '2017-09-14T15:26:43.506Z',
        duration: 240,
      },
      {
        title:
          'Watched WATCH NOW: NASA Earth From Space (HDVR) ♥ ISS LIVE FEED #AstronomyDay2018 | Subscribe now!',
        titleUrl: 'https://www.youtube.com/watch?v=RtU_mdL2vBM',
        time: '2017-09-03T13:13:23.530Z',
        duration: 1800,
        realDuration: 46043514,
      },
    ]);
  });
});
