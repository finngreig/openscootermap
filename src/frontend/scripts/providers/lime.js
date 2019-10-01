import {limeIcon} from "../utils/icons";
import * as L from "leaflet";

/**
 * Loader for the Lime API. Returns an array of vehicle objects that conform to a common format.
 * @param northEast             The coordinates of the northeast corner of the map currently in the viewport
 * @param southWest             The coordinates of the southwest corner of the map currently in the viewport
 * @param userLat               The latitude of the user's location
 * @param userLon               The longitude of the user's location
 * @returns {Promise<Array>}    Promise which returns the array of vehicle objects.
 */
function loader(northEast, southWest, userLat, userLon) {
    northEast = `${northEast.lat},${northEast.lng}`;
    southWest = `${southWest.lat},${southWest.lng}`;

    return fetch(`https://vehicles.scootermap.com/api/vehicles?user_location=${userLat},${userLon}&northeast_point=${northEast}&southwest_point=${southWest}&company=lime&mode=ride&randomize=false`)
        .then((res) => {
            return res.json().then((data) => {
                return data.vehicles.map((vehicle) => {
                    return {
                        id: vehicle.vehicle_id,
                        lat: vehicle.latitude,
                        lon: vehicle.longitude,
                        battery: vehicle.battery_level
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