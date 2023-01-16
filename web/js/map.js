var map = L.map('map', {
    scrollWheelZoom: false,
    zoomControl: false
}).setView([46.70950052897342, 32.41241455078126], 12);

new L.Control.Zoom({ position: 'topright' }).addTo(map);

'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
'https://mt1.google.com/vt/lyrs=p&x={x}&y={y}&z={z}'
"https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png"




L.tileLayer("https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png", {
    maxZoom: 17,
    minZoom: 4,
    attribution: '© OpenStreetMap'
}).addTo(map);

// https://raw.githubusercontent.com/HubashovD/project_mykolaiv_shelling_web/main/tiles/tileset/{z}/{x}/{y}.png



// var southWest = L.latLng(51.60172, 32.08003),
//     northEast = L.latLng(51.01369, 33.00698);
// var bounds = L.latLngBounds(southWest, northEast);

// map.setMaxBounds(bounds);
// map.on('drag', function() {
//     map.panInsideBounds(bounds, { animate: true });
// });

var frontLineStyles = {
    "color": "#f3a6b2",
    "fillColor": "none",
    "stroke-width": 10
};

fetch("../data/buildings.geojson")
    .then(function(response) {
        return response.json();
    })
    .then(function(data) {
        geoData = L.geoJSON(data, {
            style: frontLineStyles,
        })
        geoData.setStyle({ 'className': 'buildings' })
        geoData.addTo(map);
    });