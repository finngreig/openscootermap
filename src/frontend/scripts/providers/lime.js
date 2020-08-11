import {limeIcon} from "../utils/icons";
import * as L from "leaflet";

/**
 * Loader for the Lime API. Returns an array of vehicle objects that conform to a common format.
 * @param northEast             The coordinates of the northeast corner of the map currently in the viewport
 * @param southWest             The coordinates of the southwest corner of the map currently in the viewport
 * @returns {Promise<Array>}    Promise which returns the array of vehicle objects.
 */
function loader(northEast, southWest) {

    const centreLat = (northEast.lat + southWest.lat) / 2;
    const centreLon = (northEast.lng + southWest.lng) / 2;

    return fetch(`${window.location.href}.netlify/functions/lime?lat=${centreLat}&lon=${centreLon}&range=100.0`)
        .then((res) => {
            return res.json().then((data) => {
                if (!data.data) return [];
                return data.data.scooters.map((scooter) => {
                    return {
                        plate_number: scooter.id,
                        latitude: scooter.bestLocation.coordinates[1],
                        longitude: scooter.bestLocation.coordinates[0],
                        battery_level: `${scooter.lastReportedBattery}%`
                    }
                });
            }).catch((err) => {
                console.error(err);
            })
        })
}

export const Beam = {
    brand: 'Lime',
    icon: limeIcon,
    group: L.layerGroup(),
    loader
};
