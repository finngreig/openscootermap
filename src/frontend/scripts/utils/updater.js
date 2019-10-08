import updateScooter from "./updateVehicle";
import * as L from "leaflet";

/**
 * Function that adds new vehicle markers to the map or updates the location of markers already on the map if the vehicle's
 * location has changed.
 * @param vehicleObject     The vehicle provider's object e.g. Lime
 * @param northEast         The coordinates of the northeast corner of the map currently in the viewport
 * @param southWest         The coordinates of the southwest corner of the map currently in the viewport
 * @param userLat           The latitude of the user's location
 * @param userLon           The longitude of the user's location
 */
export default function (vehicleObject, northEast, southWest) {
    vehicleObject.loader(northEast, southWest)
        .then((vehicles) => {
            vehicles.forEach((item) => {
                const existingScooters = Object.keys(vehicleObject.group._layers).map((v) => vehicleObject.group._layers[v].options.vehicleId);
                if (!existingScooters.includes(item.id)) {
                    const mark = L.marker([item.lat, item.lon], {
                        icon: vehicleObject.icon,
                        vehicleId: item.id
                    }).addTo(vehicleObject.group);
                    mark.bindPopup(`<span>Brand: ${vehicleObject.brand}</span><br><span>Battery level: ${item.battery}</span>`);
                } else {
                    updateScooter(vehicleObject.group, item);
                }
            })
        })
}