import * as L from "leaflet";

/**
 * Function that updates an existing vehicle's marker on the map, when its location changes.
 * @param group         The group object that contains the marker
 * @param newVehicle    The object for the vehicle containing the id, latitude and longitude etc.
 */
export default function (group, newVehicle) {
    const existingMarkerKey = Object.keys(group._layers).find(s => group._layers[s].options.vehicleId === newVehicle.id);
    const markerToUpdate = group._layers[existingMarkerKey];
    markerToUpdate._latlng = new L.LatLng(newVehicle.lat, newVehicle.lon);
    group._layers[existingMarkerKey] = markerToUpdate;
};