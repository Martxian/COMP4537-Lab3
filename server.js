const express = require('express');

const app = express();

app.get('/', (req, res) => {
    const name = req.query.name;
    const currentTime = new Date().toISOString();
    const message = `Hello, ${name}! The current server time is ${currentTime}`;
    res.send(`<p style="color: blue;">${message}</p>`);
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});