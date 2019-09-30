import updateScooter from "./updateVehicle";
import * as L from "leaflet";

export default function (vehicleObject, northEast, southWest, userLat, userLon) {
    vehicleObject.loader(northEast, southWest, userLat, userLon)
        .then((vehicles) => {
            vehicles.forEach((item) => {
                const existingScooters = Object.keys(vehicleObject.group._layers).map((v) => vehicleObject.group._layers[v].options.vehicleId);
                if (!existingScooters.includes(item.id)) {
                    const mark = L.marker([item.lat, item.lon], {
                        icon: vehicleObject.icon,
                        vehicleId: item.id
                    }).addTo(vehicleObject.group);
                    mark.bindPopup(`<span>Brand: ${vehicleObject.brand}</span><br><span>Battery level: ${item.battery.toUpperCase()}</span>`);
                } else {
                    updateScooter(vehicleObject.group, item);
                }
            })
        })
}