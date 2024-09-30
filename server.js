const url = require('url');
const { getDate } = require('./modules/utils.js');
const lang = require('./lang/messages/en/en.js');

module.exports = (req, res) => {
    const parsedUrl = url.parse(req.url, true);
    const query = parsedUrl.query;
    const path = parsedUrl.pathname;

    // Check if the path is root `/` and the name query parameter exists
    if (path === '/') {
        const name = query.name;
        const currentTime = getDate();
        const message = lang.greeting.replace('%1', name).replace('%2', currentTime);

        // Respond with the message styled in blue
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(`<p style="color: blue;">${message}</p>`);
    } else {
        res.writeHead(404, { 'Content-Type': 'text/html' });
        res.end('<p style="color: red;">404: Not Found</p>');
    }
};
