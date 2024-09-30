const url = require('url');
const { getDate } = require('./modules/utils.js');
const lang = require('./lang/messages/en.js');

// Vercel handler function
module.exports = (req, res) => {
    const parsedUrl = url.parse(req.url, true);
    const query = parsedUrl.query;
    const path = parsedUrl.pathname;

    // Handle greeting and time response for the /getDate endpoint
    if (path === '/COMP4537/labs/3/getDate/' && query.name) {
        const name = query.name;
        const currentTime = getDate();
        const message = lang.greeting.replace('%1', name).replace('%2', currentTime);

        // Respond with message styled in blue
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(`<p style="color: blue;">${message}</p>`);
    } else {
        res.writeHead(404, { 'Content-Type': 'text/html' });
        res.end('<p style="color: red;">404: Not Found</p>');
    }
};
