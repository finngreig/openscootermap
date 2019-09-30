import * as L from "leaflet";
import updater from "./utils/updater";
import {Lime, Onzo} from "./providers";

let userLat = null;
let userLon = null;
let currentPos = null;

// function init() {
//     const providers = require("./providers");
//     const providerKeys = Object.keys(providers);
//
//     let markerGroups = {};
//     let markerLayers = [];
//
//     providerKeys.forEach(key => {
//         markerGroups.key = providers[key];
//         markerLayers.push(providers[key].group);
//     });
//
//     return [markerGroups, markerLayers]
// }
//
// const [markerGroups, markerLayers] = init();

const markerGroups = {
    "Lime": Lime.group,
    "Onzo": Onzo.group
};

const markerLayers = [Lime.group, Onzo.group];

const map = L.map('mapid', {
    layers: markerLayers
}).setView([-40.9006, 174.8860], 5);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    noWrap: true
}).addTo(map);

L.control.layers(null, markerGroups).addTo(map);

map.locate({setView: false,
    maxZoom: 16,
    watch: true,
    enableHighAccuracy: true
});

map.on('locationfound', function (e) {
    if (currentPos) {
        map.removeLayer(currentPos);
    } else {
        map.setView([e.latlng.lat, e.latlng.lng], 16)
    }
    currentPos = L.marker(e.latlng).addTo(map);
    userLat = e.latlng.lat;
    userLon = e.latlng.lng;
});

map.on('moveend', function () {
    let northEast = map.getBounds().getNorthEast();
    let southWest = map.getBounds().getSouthWest();

    updater(Lime, northEast, southWest, userLat, userLon);
    updater(Onzo, northEast, southWest, userLat, userLon);
});