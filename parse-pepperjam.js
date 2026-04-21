const fs = require('fs');
const Papa = require('papaparse');
const text = fs.readFileSync('/Users/venugopal/Downloads/Assets.csv', 'utf8');
const parsed = Papa.parse(text, { header: true, skipEmptyLines: true });
if (parsed.data.length > 0) {
    console.log("Headers:", Object.keys(parsed.data[0]));
}
