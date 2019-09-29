const Bundler = require('parcel-bundler');
const express = require('express');
const proxy = require('http-proxy-middleware');

const app = express();

app.use('/.netlify/*', proxy({
    target: 'http://localhost:9000'
}));

const bundler = new Bundler('./src/frontend/index.html');
app.use(bundler.middleware());

app.listen(Number(process.env.PORT || 1234));