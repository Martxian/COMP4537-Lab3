const http = require('http');
const url = require('url');
const fs = require('fs').promises;
const path = require('path');
const os = require('os');

class Server {
    constructor() {
        this.server = http.createServer(this.handleRequest.bind(this));
        this.PORT = process.env.PORT || 8080;
        this.utils = require('./modules/utils.js');
        this.lang = require('./lang/messages/en/en.js');
        this.filePath = path.join(os.tmpdir(), 'file.txt');
    }

    async handleRequest(req, res) {
        const parsedUrl = url.parse(req.url, true);
        const query = parsedUrl.query;
        const pathname = parsedUrl.pathname;

        try {
            if (pathname === '/getDate' && query.name) {
                await this.handleGetDate(req, res, query);
            } else if (pathname === '/writeFile' && query.text) {
                await this.handleWriteFile(req, res, query);
            } else if (pathname === '/readFile') {
                await this.handleReadFile(req, res);
            } else {
                this.handleNotFound(res);
            }
        } catch (error) {
            this.handleError(res, error);
        }
    }

    async handleGetDate(req, res, query) {
        const name = query.name;
        const currentTime = this.utils.getDate();
        const message = this.lang.greeting.replace('%1', name).replace('%2', currentTime);

        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(`<p style="color: blue;">${message}</p>`);
    }

    async handleWriteFile(req, res, query) {
        const text = query.text;
        try {
            await fs.appendFile(this.filePath, text + '\n');
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(`<p>Text "${text}" appended to file.txt</p>`);
        } catch (error) {
            console.error('Error writing to file:', error);
            this.handleError(res, error);
        }
    }

    async handleReadFile(req, res) {
        try {
            const data = await fs.readFile(this.filePath, 'utf8');
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(`<pre>${data}</pre>`);
        } catch (error) {
            if (error.code === 'ENOENT') {
                res.writeHead(404, { 'Content-Type': 'text/html' });
                res.end(`<p>404: File "file.txt" not found</p>`);
            } else {
                console.error('Error reading file:', error);
                this.handleError(res, error);
            }
        }
    }

    handleNotFound(res) {
        res.writeHead(404, { 'Content-Type': 'text/html' });
        res.end('<p style="color: red;">404: Not Found</p>');
    }

    handleError(res, error) {
        console.error(error);
        res.writeHead(500, { 'Content-Type': 'text/html' });
        res.end('<p>Internal Server Error</p>');
    }

    start() {
        this.server.listen(this.PORT, () => {
            console.log(`Server is running at http://localhost:${this.PORT}`);
        });
    }
}

const server = new Server();
server.start();