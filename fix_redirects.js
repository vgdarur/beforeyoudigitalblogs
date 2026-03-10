const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
    fs.readdirSync(dir).forEach(file => {
        let dirPath = path.join(dir, file);
        let isDirectory = fs.statSync(dirPath).isDirectory();
        isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, file));
    });
}

walkDir('/Users/venugopal/Documents/antigravity/First/src/app/api', (filePath) => {
    if (filePath.endsWith('.ts') || filePath.endsWith('.tsx')) {
        let content = fs.readFileSync(filePath, 'utf8');
        let original = content;
        // We want to replace all occurrences of: new URL('...', request.url)
        // with: new URL('...', process.env.NEXTAUTH_URL || request.url)
        content = content.replace(/new URL\(([^,]+?),\s*request\.url\)/g, "new URL($1, process.env.NEXTAUTH_URL || request.url)");
        if (content !== original) {
            fs.writeFileSync(filePath, content, 'utf8');
            console.log(`Updated ${filePath}`);
        }
    }
});
