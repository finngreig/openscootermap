import {onzoIcon} from "../utils/icons";
import * as L from "leaflet";

function loader(northEast, southWest) {
    const centreLat = (northEast.lat + southWest.lat) / 2;
    const centreLon = (northEast.lng + southWest.lng) / 2;

    return fetch(`${window.location.href}.netlify/functions/onzo?lat=${centreLat}&lon=${centreLon}&range=100.0`)
        .then((res) => {
            return res.json().then((data) => {
                return data.data.map((vehicle) => {
                    return {
                        id: vehicle.id,
                        lat: vehicle.latitude,
                        lon: vehicle.longitude,
                        battery: `${vehicle.battery}%`
                    }
                });
            }).catch((err) => {
                console.error(err);
            })
        })
}

export const Onzo = {
    brand: 'Onzo',
    icon: onzoIcon,
    group: L.layerGroup(),
    loader
};