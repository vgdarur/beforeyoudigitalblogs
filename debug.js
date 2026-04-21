const fs = require('fs');
const Papa = require('papaparse');
const text = fs.readFileSync('/Users/venugopal/Downloads/impact.csv', 'utf8');
const parsed = Papa.parse(text, { header: true, skipEmptyLines: true });
console.log(parsed.data[0]['Image Url']);
console.log("---- KEYS ----");
console.log(Object.keys(parsed.data[0]));
console.log("---- VALUES ----");
console.log(Object.values(parsed.data[0]).slice(13, 20)); // Name through price
