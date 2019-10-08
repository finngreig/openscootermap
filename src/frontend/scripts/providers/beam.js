import {beamIcon} from "../utils/icons";
import * as L from "leaflet";

/**
 * Loader for the Beam API. Returns an array of vehicle objects that conform to a common format.
 * @param northEast             The coordinates of the northeast corner of the map currently in the viewport
 * @param southWest             The coordinates of the southwest corner of the map currently in the viewport
 * @returns {Promise<Array>}    Promise which returns the array of vehicle objects.
 */
function loader(northEast, southWest) {

    const centreLat = (northEast.lat + southWest.lat) / 2;
    const centreLon = (northEast.lng + southWest.lng) / 2;

    return fetch(`${window.location.href}.netlify/functions/beam?lat=${centreLat}&lon=${centreLon}&range=100.0`)
        .then((res) => {
            return res.json().then((data) => {
                if (!data.data) return [];
                return data.data.scooters.map((scooter) => {
                    return {
                        id: scooter.id,
                        lat: scooter.bestLocation.coordinates[1],
                        lon: scooter.bestLocation.coordinates[0],
                        battery: `${scooter.lastReportedBattery}%`
                    }
                });
            }).catch((err) => {
                console.error(err);
            })
        })
}

export const Beam = {
    brand: 'Beam',
    icon: beamIcon,
    group: L.layerGroup(),
    loader
};
