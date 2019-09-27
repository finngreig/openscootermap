const express = require('express');
const path = require('path');
const logger = require('morgan');
const fetch = require('node-fetch');

const app = express();

app.use(logger('dev'));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/onzo/:lat/:lon/:range', async function (req, res) {
    const apiResponse = await fetch(`https://app.onzo.co.nz/nearby/${req.params.lat}/${req.params.lon}/5000.0.json`,
        {
            headers: {
                "Accept": "application/json, text/plain, */*",
                "Origin": "https://app.onzo.co.nz",
                "Referer": "https://app.onzo.co.nz/nearby",
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; rv:68.0) Gecko/20100101 Firefox/68.0"
            }
        });
    return res.json(await apiResponse.json()).end();
});

module.exports = app;
