import "leaflet";
import 'leaflet.markercluster';
import 'leaflet.markercluster.layersupport';
import updater from "./utils/updater";
import {Lime, Onzo, Beam, Bird, Flamingo} from "./providers";
import '../styles/clusterMarker.css';

let userLat = null;
let userLon = null;
let currentPos = null;

const groups = {
    "Lime": Lime.group,
    "Onzo": Onzo.group,
    "Beam": Beam.group,
    "Bird (and Partners)": Bird.group,
    "Flamingo": Flamingo.group
};

const map = L.map('mapid').setView([-40.9006, 174.8860], 5);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    noWrap: true
}).addTo(map);

const markerClusterLayerSupport = L.markerClusterGroup.layerSupport({
    iconCreateFunction: function(cluster) {
        return L.divIcon({
            iconSize: [40, 40],
            className: 'clusterMarker',
            html: '<b>' + cluster.getChildCount() + '</b>'
        });
    }
});
markerClusterLayerSupport.addTo(map);
markerClusterLayerSupport.checkIn(Object.values(groups));

L.control.layers(null, groups).addTo(map);

Object.values(groups).forEach(item => item.addTo(map));

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
        map.setView([e.latlng.lat, e.latlng.lng], 16);
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

    updater(Lime, northEast, southWest);
    updater(Onzo, northEast, southWest);
    updater(Beam, northEast, southWest);
    updater(Bird, northEast, southWest);
    updater(Flamingo);

    markerClusterLayerSupport.refreshClusters();
}

map.on('moveend', function () {
    updateAll();
});
