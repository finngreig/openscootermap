import {updateScooter} from "./vehicleUtils.js";

export const loadFromScooterMap = function (map, userLat, userLon, company, icon, group) {
    let northEast = map.getBounds().getNorthEast();
    let southWest = map.getBounds().getSouthWest();

    northEast = `${northEast.lat},${northEast.lng}`;
    southWest = `${southWest.lat},${southWest.lng}`;

    if (!userLat || !userLon) return;

    fetch(`https://vehicles.scootermap.com/api/vehicles?user_location=${userLat},${userLon}&northeast_point=${northEast}&southwest_point=${southWest}&company=${company}&mode=ride&randomize=false`)
        .then(async function (response) {
            const scooterArray = await response.json();
            scooterArray.vehicles.forEach(function (element) {
                let existingScooters = Object.keys(group._layers).map(s => group._layers[s].options.vehicleId);
                if (!existingScooters.includes(element.vehicle_id)) {
                    const mark = L.marker([element.latitude, element.longitude], {
                        icon: icon,
                        vehicleId: element.vehicle_id
                    }).addTo(group);
                    mark.bindPopup(`<span>Brand: ${element.company.toUpperCase()}</span><br><span>Battery level: ${element.battery_level.toUpperCase()}</span>`);
                } else {
                    updateScooter(group, element);
                }
            })
        });
};

export const loadOnzo = function(map, icon, group) {
    let northEast = map.getBounds().getNorthEast();
    let southWest = map.getBounds().getSouthWest();

    let centreLat = (northEast.lat + southWest.lat) / 2;
    let centreLon = (northEast.lng + southWest.lng) / 2;

    fetch(`${window.location.href}onzo/${centreLat}/${centreLon}/100.0`)
        .then(async function (response) {
            const scooterArray = await response.json();
            scooterArray.data.forEach(function (element) {
                let existingScooters = Object.keys(group._layers).map(s => group._layers[s].options.vehicleId);
                if (!existingScooters.includes(element.id)) {
                    const mark = L.marker([element.latitude, element.longitude], {
                        icon: icon,
                        vehicleId: element.id
                    }).addTo(group);
                    mark.bindPopup(`<span>Brand: ONZO</span><br><span>Battery level: ${element.battery}%</span>`);
                } else {
                    updateScooter(group, element);
                }
            })
        });
};