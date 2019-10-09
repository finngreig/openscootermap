import { flamingoIcon } from "../utils/icons";
import * as L from "leaflet";

const cities = ["auckland", "wellington", "christchurch"];

/**
 * Retrieves all available scooters within a given city from the Flamingo API
 * @param city                  City name
 * @returns {Promise<Array>}    Promise which returns the array of vehicle objects.
 */
function getFromCity(city) {
    return fetch(`https://api.flamingoscooters.com/gbfs/${city}/free_bike_status.json`)
        .then(res => {
            return res.json().then(json => {
                return json.data.bikes.map(vehicle => {
                    return {
                        id: vehicle.bike_id,
                        lat: vehicle.lat,
                        lon: vehicle.lon,
                        battery: 'Not reported'
                    };
                });
            }).catch(err => {
                console.error(err);
                return [];
            });
        });
}

/**
 * Loader for the Flamingo API. Returns an array of vehicle objects that conform to a common format.
 * @returns {Promise<Array>}    Promise which returns the array of vehicle objects.
 */
function loader() {
    return Promise.all(cities.map(city => getFromCity(city))).then(promises => [].concat(...promises));
}

export const Flamingo = {
    brand: 'Flamingo',
    icon: flamingoIcon,
    group: L.layerGroup(),
    loader
};