const fs = require('fs');
const Papa = require('papaparse');

const inputPath = '/Users/venugopal/Downloads/impact.txt';
const outputPath = '/Users/venugopal/Downloads/impact.csv';

const text = fs.readFileSync(inputPath, 'utf8');

console.log('Parsing TSV...');
const parsed = Papa.parse(text, { header: true, delimiter: "\t" });

console.log('Converting to CSV...');
const csv = Papa.unparse(parsed.data);

fs.writeFileSync(outputPath, csv);
console.log('Success! Saved to ' + outputPath);
