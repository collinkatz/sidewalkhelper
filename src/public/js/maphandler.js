async function initMap(county) {
    map = new google.maps.Map(document.getElementById("map"), {
        center: { lat: 39.29360, lng: -76.81646 }, // TODO: need to change these to update based on user location
        zoom: 16,
    });
    google.maps.event.addListenerOnce(map, "idle", async function () {
        var bounds = await mapBounds()
        console.log("ne: (lat: " + bounds["ne"]["lat"] + ", lng: " + bounds["ne"]["lng"] + ") sw: (lat: " + bounds["sw"]["lat"] + ", lng: " + bounds["sw"]["lng"] + ")")
        var response = await fetch("/queryCountyData", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                "ne": bounds["ne"],
                "sw": bounds["sw"],
                "county": county
            })
        });
        console.log(response)
        var responseGeoJSON = await response.json()
        console.log(responseGeoJSON)
        map.data.loadGeoJson(responseGeoJSON) // TODO: Needs rejected promise handling??
        console.log(fromServer)
    });
    async function mapBounds() {
        northEast = map.getBounds().getNorthEast()
        southWest =  map.getBounds().getSouthWest()
        return {"ne": {"lat": northEast.lat(), "lng": northEast.lng()},"sw": {"lat": southWest.lat(), "lng": southWest.lng()}}
    }
}