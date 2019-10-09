import * as L from 'leaflet';
const iconBase = {
    iconSize: [25, 25],
    iconAnchor: [12, -1]
};

export const limeIcon = new L.Icon({
    iconUrl: require("../../assets/lime.png"),
    ...iconBase
});

export const onzoIcon = new L.Icon({
    iconUrl: require("../../assets/onzo.png"),
    ...iconBase
});

export const beamIcon = new L.Icon({
    iconUrl: require("../../assets/beam.png"),
    ...iconBase
});

export const birdIcon = new L.Icon({
    iconUrl: require("../../assets/bird.png"),
    ...iconBase
});

export const flamingoIcon = new L.Icon({
    iconUrl: require("../../assets/flamingo.png"),
    iconSize: [25, 39],
    iconAnchor: [12, -1]
});