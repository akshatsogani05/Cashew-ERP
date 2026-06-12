const fs = require('fs');
const path = require('path');

function cleanFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');

    // Remove Action line
    content = content.replace(/^.*--file-text "/s, '');

    // Remove Observation line at end
    content = content.replace(/"\s*Observation:.*$/s, '');

    // Unescape quotes
    content = content.replace(/\\"/g, '"');

    // Unescape backslashes
    content = content.replace(/\\\\/g, '\\');

    fs.writeFileSync(filePath, content, 'utf8');
    console.log('Fixed:', filePath);
}

function walk(dir) {
    const files = fs.readdirSync(dir);

    for (const file of files) {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);

        if (stat.isDirectory()) {
            walk(fullPath);
        } else if (
            fullPath.endsWith('.js') ||
            fullPath.endsWith('.jsx') ||
            fullPath.endsWith('.css')
        ) {
            cleanFile(fullPath);
        }
    }
}

walk('./src');
console.log('Done');