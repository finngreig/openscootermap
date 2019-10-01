import {onzoIcon} from "../utils/icons";
import * as L from "leaflet";

/**
 * Loader for the Onzo API. Returns an array of vehicle objects that conform to a common format.
 * @param northEast             The coordinates of the northeast corner of the map currently in the viewport
 * @param southWest             The coordinates of the southwest corner of the map currently in the viewport
 * @returns {Promise<Array>}    Promise which returns the array of vehicle objects.
 */
function loader(northEast, southWest) {

    /*
    The Onzo API returns bikes based on a circular area centred around a single set of coordinates - an approximate set of
    coordinates of the centre of the viewport are used.
     */
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