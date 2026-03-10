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

        // We want to replace process.env.NEXTAUTH_URL || request.url
        // with dynamically determining the host from headers
        // But since it's hard to inject `import { headers }` into every file, we can just use request.headers!

        // Replace logic: 
        // `new URL(..., process.env.NEXTAUTH_URL || request.url)`
        // -> `new URL(..., \`\${request.headers.get('x-forwarded-proto') || 'http'}://\${request.headers.get('x-forwarded-host') || request.headers.get('host')}\`)`

        let regex = /process\.env\.NEXTAUTH_URL \|\| request\.url/g;
        let replacement = "`\\${request.headers.get('x-forwarded-proto') || (process.env.NODE_ENV === 'production' ? 'https' : 'http')}://${request.headers.get('x-forwarded-host') || request.headers.get('host') || 'localhost:3000'}`";

        content = content.replace(regex, replacement);

        if (content !== original) {
            fs.writeFileSync(filePath, content, 'utf8');
            console.log(`Updated ${filePath}`);
        }
    }
});
