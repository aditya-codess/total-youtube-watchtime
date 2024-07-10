const fs = require('fs');
const handlebars = require('handlebars');
const examples = require('../watch-history.json');
const process = require('./process');
const aggregate = require('./aggregate');
const result = aggregate(process(examples));

fs.readFile('chart-template.html.handlebars', (err, template) => {
  if (err) throw err;
  const hb = handlebars.compile(template.toString());
  fs.writeFile(
    'report.html',
    hb({
      labels: JSON.stringify(result.labels),
      hours: JSON.stringify(result.hours),
    }),
    'utf8',
    () => {},
  );
});
