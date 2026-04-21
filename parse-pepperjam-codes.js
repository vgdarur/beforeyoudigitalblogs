const fs = require('fs');
const Papa = require('papaparse');
const text = fs.readFileSync('/Users/venugopal/Downloads/Assets.csv', 'utf8');
const parsed = Papa.parse(text, { header: true, skipEmptyLines: true });
const withCodes = parsed.data.filter(row => row.DealDefaultDiscountCode && row.DealDefaultDiscountCode.trim() !== '');
console.log("Total rows:", parsed.data.length);
console.log("Rows with codes:", withCodes.length);
if (withCodes.length > 0) {
    console.log("Sample code row:", withCodes[0]);
}
