import * as L from "leaflet";

export default function (group, newVehicle) {
    const existingMarkerKey = Object.keys(group._layers).find(s => group._layers[s].options.vehicleId === newVehicle.id);
    const markerToUpdate = group._layers[existingMarkerKey];
    markerToUpdate._latlng = new L.LatLng(newVehicle.lat, newVehicle.lon);
    group._layers[existingMarkerKey] = markerToUpdate;
};