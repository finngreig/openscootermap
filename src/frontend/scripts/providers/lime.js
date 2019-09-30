import {limeIcon} from "../utils/icons";
import * as L from "leaflet";

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