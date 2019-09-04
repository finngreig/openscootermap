const express = require('express');
const path = require('path');
const logger = require('morgan');
const fetch = require('node-fetch');

const app = express();

// const redis = require('redis'),
//     client = redis.createClient();

app.use(logger('dev'));
app.use(express.static(path.join(__dirname, 'public')));

const parse = (req, res, next) => {
    const keys = Object.keys(req.query);
    if (!(keys.length === 4 && keys.includes("user_location") && keys.includes("northeast_point") &&
        keys.includes("southwest_point") && keys.includes("company"))) {
        return res.status(401).end();
    }

    let str = [];
    for (let p in req.query) {
        if (req.query.hasOwnProperty(p)) {
            str.push(encodeURIComponent(p) + "=" + encodeURIComponent(req.query[p]));
        }
    }
    req.body = str.join("&");
    next();
};

app.get('/scooters', parse, async (req, res) => {

    // client.exists(reqQs, (err, reply) => {
    //     console.log("Exists: " + reply);
    //     client.get(reqQs, (err, reply) => {
    //         console.log("Get: " + reply);
    //         return res.json(reply);
    //     });
    // });

    fetch("https://vehicles.scootermap.com/api/vehicles?" + req.body + "&mode=ride&randomize=false",
        {
            headers: {
                "Accept": "application/json, text/plain, */*",
                "Origin": "https://scootermap.com",
                "Referer": "https://scootermap.com/map",
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; rv:68.0) Gecko/20100101 Firefox/68.0"
            }
        })
        .then(body => body.json())
        .then(body => res.json(body));
});

module.exports = app;
