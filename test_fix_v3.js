const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
    fs.readdirSync(dir).forEach(file => {
        let dirPath = path.join(dir, file);
        if (fs.statSync(dirPath).isDirectory()) {
            walkDir(dirPath, callback);
        } else {
            callback(path.join(dir, file));
        }
    });
}

walkDir('/Users/venugopal/Documents/antigravity/First/src/app/api', (filePath) => {
    if (filePath.endsWith('.ts') || filePath.endsWith('.tsx')) {
        let content = fs.readFileSync(filePath, 'utf8');
        let original = content;

        let brokenString = "`\\${request.headers.get('x-forwarded-proto') || (process.env.NODE_ENV === 'production' ? 'https' : 'http')}://${request.headers.get('x-forwarded-host') || request.headers.get('host') || 'localhost:3000'}`";

        // String template literals WITHOUT escaping the $
        let fixedString = "`${request.headers.get('x-forwarded-proto') || (process.env.NODE_ENV === 'production' ? 'https' : 'http')}://${request.headers.get('x-forwarded-host') || request.headers.get('host') || 'localhost:3000'}`";

        // Global replace
        content = content.split(brokenString).join(fixedString);

        if (content !== original) {
            fs.writeFileSync(filePath, content, 'utf8');
            console.log(`Fixed ${filePath}`);
        }
    }
});
