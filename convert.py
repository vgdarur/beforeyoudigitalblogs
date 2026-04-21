import csv

input_path = '/Users/venugopal/Downloads/impact.csv'
output_path = '/Users/venugopal/Downloads/impact_converted.csv'

try:
    with open(input_path, 'r', encoding='utf-8') as tsvin, open(output_path, 'w', newline='', encoding='utf-8') as csvout:
        tsvin = csv.reader(tsvin, delimiter='\t')
        csvout = csv.writer(csvout, quoting=csv.QUOTE_MINIMAL)

        for row in tsvin:
            csvout.writerow(row)
    print('Conversion successful: /Users/venugopal/Downloads/impact_converted.csv')
except Exception as e:
    print('Error:', e)
