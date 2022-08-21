async function initMap(county) { // Setup map and event listeners

    map = new google.maps.Map(document.getElementById("map"), {
        center: { lat: 39.29360, lng: -76.81646 }, // TODO: need to change these to update based on user location
        zoom: 16,
    });

    var features = {};

    google.maps.event.addListener(map, "idle", debounce(() => mapQuery(map))) // Add listener for when map idles on page

    async function mapQuery(mapObj) {
        clearFeatures(features);
        var bounds = await mapBounds(mapObj)
        console.log("Query--- ne: (lat: " + bounds["ne"]["lat"] + ", lng: " + bounds["ne"]["lng"] + ") sw: (lat: " + bounds["sw"]["lat"] + ", lng: " + bounds["sw"]["lng"] + ")")
        fetch("/queryCountyData", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                "bounds": bounds,
                "county": county
            })
        }).then((response) => {
            console.log(response)
            response.json().then((responseGeoJSON) => {
                console.log(responseGeoJSON)
                features = mapObj.data.addGeoJson(responseGeoJSON)
            });
        }, (err) => { // TODO: needs better message if promise is just canceled it's not an error
            console.log("error: " + err)
        });
    }

    function debounce(func, timeout = 1000){
        let timer;
        return (...args) => {
            clearTimeout(timer);
            timer = setTimeout(() => { func.apply(this, args); }, timeout);
        };
    }
      

    function clearFeatures(features) {
        if (features.length != 0) {
            for (var i = 0; i < features.length; i++) {
                map.data.remove(features[i]);
            }
        }
    }

    async function mapBounds(mapObj) {
        northEast = mapObj.getBounds().getNorthEast()
        southWest =  mapObj.getBounds().getSouthWest()
        return {"ne": {"lat": northEast.lat(), "lng": northEast.lng()},"sw": {"lat": southWest.lat(), "lng": southWest.lng()}}
    }

}
