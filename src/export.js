const fs = require('fs');
const history = require('../watch-history.json');
const process = require('./process');
const result = process(history);

// taken from https://stackoverflow.com/a/31536517/606571
const replacer = (key, value) =>
  !value ? '' : value.toString().replace(/[,|"]/g, ''); // specify how you want to handle null values here
const header = Object.keys(result[0]);
let csv = result.map((row) =>
  header.map((fieldName) => JSON.stringify(row[fieldName], replacer)).join(','),
);
csv.unshift(header.join(','));
csv = csv.join('\r\n');

fs.writeFile('export.csv', csv, 'utf8', () => {});
