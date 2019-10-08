import {birdIcon, limeIcon} from "../utils/icons";
import * as L from "leaflet";

class ScooterMap {
    constructor(brand, icon) {
        this.brand = brand;
        this.icon = icon;
        this.group = L.layerGroup();
    }

    /**
     * Loader for the ScooterMap API. Returns an array of vehicle objects that conform to a common format.
     * @param northEast             The coordinates of the northeast corner of the map currently in the viewport
     * @param southWest             The coordinates of the southwest corner of the map currently in the viewport
     * @param userLat               The latitude of the user's location
     * @param userLon               The longitude of the user's location
     * @returns {Promise<Array>}    Promise which returns the array of vehicle objects.
     */
    loader(northEast, southWest) {
        const centreLat = (northEast.lat + southWest.lat) / 2;
        const centreLon = (northEast.lng + southWest.lng) / 2;

        northEast = `${northEast.lat},${northEast.lng}`;
        southWest = `${southWest.lat},${southWest.lng}`;

        return fetch(`${window.location.href}.netlify/functions/scootermap?userLat=${centreLat}&userLon=${centreLon}&northEast=${northEast}&southWest=${southWest}&company=${this.brand.toLowerCase()}`)
            .then((res) => {
                if (res.status === 500) return [];
                return res.json().then((data) => {
                    return data.vehicles.map((vehicle) => {
                        return {
                            id: vehicle.vehicle_id,
                            lat: vehicle.latitude,
                            lon: vehicle.longitude,
                            battery: vehicle.battery_level || 'Not reported'
                        }
                    });
                }).catch((err) => {
                    console.error(err);
                })
            })
    }
}

export const Lime = new ScooterMap('Lime', limeIcon);
export const Bird = new ScooterMap('Bird', birdIcon);