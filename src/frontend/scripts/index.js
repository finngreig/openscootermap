import * as L from "leaflet";
import {limeIcon, onzoIcon} from "./icons.js";
import {loadFromScooterMap, loadOnzo} from "./loaders.js";

let userLat = null;
let userLon = null;

const limeGroup = L.layerGroup();
const onzoGroup = L.layerGroup();

const markerGroups = {
    "Lime": limeGroup,
    "Onzo": onzoGroup
};

const map = L.map('mapid', {
    layers: [limeGroup, onzoGroup]
}).setView([-40.9006, 174.8860], 5);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    noWrap: true
}).addTo(map);

L.control.layers(null, markerGroups).addTo(map);

map.locate({setView: true,
    maxZoom: 16
});

map.on('locationfound', function (e) {
    L.marker(e.latlng).addTo(map);
    userLat = e.latlng.lat;
    userLon = e.latlng.lng;
});

map.on('moveend', function () {
    loadFromScooterMap(map, userLat, userLon, 'lime', limeIcon, limeGroup);
    loadOnzo(map, onzoIcon, onzoGroup);
});