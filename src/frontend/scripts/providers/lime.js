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

    return fetch(`${window.location.href}.netlify/functions/lime?northEastLat=${northEast.lat}&northEastLon=${northEast.lng}&southWestLat=${southWest.lat}&southWestLon=${southWest.lng}&userLat=${centreLat}&userLon=${centreLon}`)
        .then((res) => {
            return res.json().then((data) => {
                if (!data.data) return [];
                return data.data.attributes.bikes
                    .filter((scooter) => scooter.attributes.brand === 'lime')
                    .map((scooter) => {
                    return {
                        id: scooter.attributes.plate_number,
                        lat: scooter.attributes.latitude,
                        lon: scooter.attributes.longitude,
                        battery: `${Math.floor((scooter.attributes.meter_range / 25000) * 100)}%`
                    }
                });
            }).catch((err) => {
                console.error(err);
            })
        })
}

export const Lime = {
    brand: 'Lime',
    icon: limeIcon,
    group: L.layerGroup(),
    loader
};
