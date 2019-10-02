import * as L from "leaflet";
import updater from "./utils/updater";
import {Lime, Onzo, Jump} from "./providers";

let userLat = null;
let userLon = null;
let currentPos = null;

const groups = {
    "Lime": Lime.group,
    "Onzo": Onzo.group,
    "Jump": Jump.group
};

const map = L.map('mapid', {
    layers: Object.values(groups)
}).setView([-40.9006, 174.8860], 5);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    noWrap: true
}).addTo(map);

L.control.layers(null, groups).addTo(map);

map.locate({setView: false,
    maxZoom: 16,
    watch: true,
    enableHighAccuracy: true,
    maximumAge: 30000
});

map.on('locationfound', function (e) {
    if (currentPos) {
        map.removeLayer(currentPos);
    } else {
        map.setView([e.latlng.lat, e.latlng.lng], 16)
        updateAll();
    }
    currentPos = L.marker(e.latlng).addTo(map);
    currentPos.bindPopup("<span>Your Location</span>");
    userLat = e.latlng.lat;
    userLon = e.latlng.lng;
});

function updateAll() {
    let northEast = map.getBounds().getNorthEast();
    let southWest = map.getBounds().getSouthWest();

    updater(Lime, northEast, southWest, userLat, userLon);
    updater(Onzo, northEast, southWest, userLat, userLon);
    updater(Jump);
}

map.on('moveend', function () {
    updateAll();
});