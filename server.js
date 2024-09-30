const http = require('http');
const url = require('url');
const fs = require('fs');
const { getDate } = require('./modules/utils.js');
const lang = require('./lang/messages/en.js');

module.exports = (req, res) => {
    const parsedUrl = url.parse(req.url, true);
    const query = parsedUrl.query;
    const path = parsedUrl.pathname;

    // Handle greeting and time response
    if (path === 'getDate' && query.name) {
        const name = query.name;
        const currentTime = getDate();
        const message = lang.greeting.replace('%1', name).replace('%2', currentTime);

        // Respond with message styled in blue
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(`<p style="color: blue;">${message}</p>`);
    }

    // Handle appending text to file
    else if (path === 'writeFile' && query.text) {
        const text = query.text;

        // Append text to file.txt
        fs.appendFile('file.txt', text + '\n', (err) => {
            if (err) {
                res.writeHead(500, { 'Content-Type': 'text/html' });
                res.end('<p>Internal Server Error</p>');
                return;
            }
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(`<p>Text "${text}" appended to file.txt</p>`);
        });
    }

    // Handle reading file content
    else if (path === 'readFile/file.txt') {
        fs.readFile('file.txt', 'utf8', (err, data) => {
            if (err) {
                if (err.code === 'ENOENT') {
                    res.writeHead(404, { 'Content-Type': 'text/html' });
                    res.end(`<p>404: File "file.txt" not found</p>`);
                } else {
                    res.writeHead(500, { 'Content-Type': 'text/html' });
                    res.end('<p>Internal Server Error</p>');
                }
                return;
            }
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(`<pre>${data}</pre>`);
        });
    }

    else {
        res.writeHead(404, { 'Content-Type': 'text/html' });
        res.end('<p style="color: red;">404: Not Found</p>');
    }
};

const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
