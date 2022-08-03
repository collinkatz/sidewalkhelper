const async = require('async')

async function initMap(county) {
    map = new google.maps.Map(document.getElementById("map"), {
        center: { lat: 39.29360, lng: -76.81646 }, // TODO: need to change these to update based on user location
        zoom: 16,
    });
    async function getMapBounds() {
        return await google.maps.event.addListenerOnce(map, 'idle', async function () {
            northEast = map.getBounds().getNorthEast().toString()
            southWest =  map.getBounds().getSouthWest().toString()
            console.log("ne:" + northEast + " sw: " + southWest)
            return {'ne': northEast, 'sw': southWest}
        });
    };
    var bounds = getMapBounds()
    console.log(bounds)
    let response = await fetch('/queryCountyData?northEast=' + bounds['ne'] + '&southWest=' + bounds['sw'] + '&county=' + county) // TODO: Modify this fetch request to be better using method: and body: and headers: Also needs rejected promise handling??
    let responseGeoJSON = await response.json()
    map.data.loadGeoJson(responseGeoJSON)
    console.log(responseGeoJSON)
}