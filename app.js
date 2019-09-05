const express = require('express');
const path = require('path');
const logger = require('morgan');
const fetch = require('node-fetch');

const app = express();

const redis = require('redis'),
    client = redis.createClient();

app.use(logger('dev'));
app.use(express.static(path.join(__dirname, 'public')));

const parse = (req, res, next) => {
    const keys = Object.keys(req.query);
    if (!(keys.length === 3 && keys.includes("northeast_point") &&
        keys.includes("southwest_point") && keys.includes("company"))) {
        return res.status(401).end();
    }

    req.body = genQs(req.query);
    next();
};

const floatCeil = (v, n) => {
    if (v < 0) {
        v = Math.abs(v);
        return -Math.ceil(v * Math.pow(10, n)) / Math.pow(10, n);
    }
    return Math.ceil(v * Math.pow(10, n)) / Math.pow(10, n);
};

const floatFloor = (v, n) => {
    if (v < 0) {
        v = Math.abs(v);
        return -Math.floor(v * Math.pow(10, n)) / Math.pow(10, n);
    }
    return Math.floor(v * Math.pow(10, n)) / Math.pow(10, n);
};

const midPoint = (latitude1, longitude1, latitude2, longitude2) => {
    const DEG_TO_RAD = Math.PI / 180;     // To convert degrees to radians.

    // Convert latitude and longitudes to radians:
    const lat1 = latitude1 * DEG_TO_RAD;
    const lat2 = latitude2 * DEG_TO_RAD;
    const lng1 = longitude1 * DEG_TO_RAD;
    const dLng = (longitude2 - longitude1) * DEG_TO_RAD;  // Diff in longitude.

    // Calculate mid-point:
    const bx = Math.cos(lat2) * Math.cos(dLng);
    const by = Math.cos(lat2) * Math.sin(dLng);
    const lat = Math.atan2(
        Math.sin(lat1) + Math.sin(lat2),
        Math.sqrt((Math.cos(lat1) + bx) * (Math.cos(lat1) + bx) + by * by));
    const lng = lng1 + Math.atan2(by, Math.cos(lat1) + bx);

    return [lat / DEG_TO_RAD, lng / DEG_TO_RAD];
};

const genQs = (params) => {

    const [northeast_lat, northeast_long] = params["northeast_point"].split(',').map(num => {
        const float = parseFloat(num);
        return floatCeil(float, 3);
    });
    const [southwest_lat, southwest_long] = params["southwest_point"].split(',').map(num => {
        const float = parseFloat(num);
        return floatFloor(float, 3);
    });
    const [user_lat, user_long] = midPoint(northeast_lat, northeast_long, southwest_lat, southwest_long)
                                    .map(num => num.toFixed(3));

    return `?user_location=${user_lat},${user_long}&northeast_point=${northeast_lat},${northeast_long}&southwest_point=
            ${southwest_lat},${southwest_long}&company=${params["company"]}`;
};

app.get('/scooters', parse, async (req, res) => {
    client.exists(req.body, async (err, reply) => {
        if (reply === 0) {
            const apiResponse = await fetch("https://vehicles.scootermap.com/api/vehicles" + req.body +
                "&mode=ride&randomize=false",
                {
                    headers: {
                        "Accept": "application/json, text/plain, */*",
                        "Origin": "https://scootermap.com",
                        "Referer": "https://scootermap.com/map",
                        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; rv:68.0) Gecko/20100101 Firefox/68.0"
                    }
                });
            const jsonResponse = await apiResponse.text();
            client.set(req.body, jsonResponse, "EX", 600, () => {
                return res.json(JSON.parse(jsonResponse)).end();
            });
        } else {
            client.get(req.body, (err, reply) => {
                return res.json(JSON.parse(reply)).end();
            });
        }
    });
});

module.exports = app;
