const express = require('express');
const path = require('path');
const logger = require('morgan');
const fetch = require('node-fetch');

const app = express();

const redis = require('redis');
let client;
if (process.env.REDIS_URL) {
    client = redis.createClient(process.env.REDIS_URL);
} else {
    client = redis.createClient();
}

app.use(logger('dev'));
app.use(express.static(path.join(__dirname, 'public')));

/**
 * A function to check that the required query parameters are in the URL and to parse the query object in the request
 * object into a string for use as a Redis key later
 * @param req           The request object
 * @param res           The response object
 * @param next          The next function in the middleware chain
 * @returns {*|number}  Ends the request with a 401 response if the query parameters are not correctly present
 */
const parse = (req, res, next) => {
    const keys = Object.keys(req.query);
    if (!(keys.length === 3 && keys.includes("northeast_point") &&
        keys.includes("southwest_point") && keys.includes("company"))) {
        return res.status(401).end();
    }

    req.body = genQs(req.query);
    next();
};

/**
 * Calculates the ceiling of a float and if the float is negative it calculates the "absolute ceiling" - technically the
 * floor of the negative float. Used for geospatial calculations.
 * @param v             The float to round to a ceiling
 * @param n             The decimal places to round to
 * @returns {number}    The rounded ceiling float
 */
const floatCeil = (v, n) => {
    if (v < 0) {
        v = Math.abs(v);
        return -Math.ceil(v * Math.pow(10, n)) / Math.pow(10, n);
    }
    return Math.ceil(v * Math.pow(10, n)) / Math.pow(10, n);
};

/**
 * Calculates the floor of a float and if the float is negative is calculates the "absolute floor" - technically the ceiling
 * of the negative float. Used for geospatial calculations.
 * @param v             The float to round to a floor
 * @param n             The decimal places to round to
 * @returns {number}    The rounded floor float
 */
const floatFloor = (v, n) => {
    if (v < 0) {
        v = Math.abs(v);
        return -Math.floor(v * Math.pow(10, n)) / Math.pow(10, n);
    }
    return Math.floor(v * Math.pow(10, n)) / Math.pow(10, n);
};

/**
 * Calculates the coordinate midpoint in a square area on the surface of the Earth.
 * @param latitude1     The latitude of the first corner in a diagonal pair
 * @param longitude1    The longitude of the first corner in a diagonal pair
 * @param latitude2     The latitude of the second corner in a diagonal pair
 * @param longitude2    The longitude of the second corner in a diagonal pair
 * @returns {*[]}       An array of latitude and longitude
 */
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

/**
 * Creates a query string from an object of query parameters, to be used as the key for values in a Redis instance.
 * @param params        The object of parameters, usually req.query
 * @returns {string}    The query string
 */
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

/**
 * Endpoint that returns a JSON array of scooters to the client. If there is nothing cached for the request then it gets
 * a response from the third-party API, caches it in Redis and then serves it to the client. If there is a value cached for
 * the request then it gets it from Redis and serves it to the client.
 */
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
