export const updateScooter = function (group, newScooter) {
    const existingMarkerKey = Object.keys(group._layers).find(s => group._layers[s].options.vehicleId === (newScooter.vehicle_id || newScooter.id));
    const markerToUpdate = group._layers[existingMarkerKey];
    markerToUpdate._latlng = new L.LatLng(newScooter.latitude, newScooter.longitude);
    group._layers[existingMarkerKey] = markerToUpdate;
};