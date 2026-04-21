const fs = require('fs');
const Papa = require('papaparse');
const text = fs.readFileSync('/Users/venugopal/Downloads/impact.txt', 'utf8');
const parsed = Papa.parse(text, { header: true, skipEmptyLines: true });
console.log("Delimiter detected:", parsed.meta.delimiter);
console.log("Total rows:", parsed.data.length);
if (parsed.data.length > 0) {
    console.log("Sample Image URL:", parsed.data[0]['Image Url']);
    console.log("Sample Price:", parsed.data[0]['Current Price']);
    console.log("Sample Name:", parsed.data[0]['Name']);
}
