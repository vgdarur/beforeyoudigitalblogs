const fs = require('fs');
const Papa = require('papaparse');
const inputPath = '/Users/venugopal/Downloads/impact_converted.csv';
const text = fs.readFileSync(inputPath, 'utf8');
const parsed = Papa.parse(text, { header: true, skipEmptyLines: true });
const configRow = Object.fromEntries(Object.entries(parsed.data[0]).map(([k, v]) => [String(k).toLowerCase().trim(), v]));
console.log(configRow);
