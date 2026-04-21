const fs = require('fs');
const Papa = require('papaparse');
const text = fs.readFileSync('/Users/venugopal/Downloads/impact (1).txt', 'utf8');
const parsed = Papa.parse(text, { header: true, skipEmptyLines: true, delimiter: "\t" });
if (parsed.data.length > 0) {
    const row = parsed.data[0];
    console.log("Headers:", Object.keys(row));
    console.log("Sample Data:");
    console.log("Currency:", row['Currency'] || row['currency']);
    console.log("Category Name:", row['Category Name'] || row['category']);
    console.log("Category Path:", row['Category Path']);
}
