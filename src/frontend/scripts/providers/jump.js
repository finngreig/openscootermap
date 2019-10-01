import { jumpIcon } from "../utils/icons";
import * as L from "leaflet";

const validCityCodes = ["dc", "sf"];

/**
 * Retrieves all available bikes within a given city from the Jump API
 * @param cityCode              City's short form city code
 * @returns {Promise<Array>}    Promise which returns the array of vehicle objects.
 */
function getFromCityCode(cityCode) {
    return fetch(`https://${cityCode}.jumpbikes.com/opendata/free_bike_status.json`).then(res => {
        return res.json().then(json => {
            return json.data.bikes.map(vehicle => {
                return {
                    id: vehicle.name,
                    lat: vehicle.lat,
                    lon: vehicle.lon,
                    battery: vehicle.jump_ebike_battery_level
                };
            });
        }).catch(err => {
            throw err;
        });
    });
}

/**
 * Loader for the Jump API. Returns an array of vehicle objects that conform to a common format.
 * @returns {Promise<Array>}    Promise which returns the array of vehicle objects.
 */
function loader() {
    return Promise.all(validCityCodes.map(cityCode => {
        return getFromCityCode(cityCode).catch(err => {
            console.error(err);
            return [];
        });
    })).then(promises => [].concat(...promises));
}

export const Jump = {
    brand: "Jump",
    icon: jumpIcon,
    group: L.layerGroup(),
    loader
};