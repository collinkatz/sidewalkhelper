var features = {};
var mapObj;

async function initMap(county) { // Setup map and event listeners

    map = new google.maps.Map(document.getElementById("map"), {
        // center: { lat: 39.29360, lng: -76.81646 }, // TODO: need to change these to update based on user location
        center: {lat: 39.199854076400115, lng: -76.77877049068805},
        zoom: 16,
    });

    mapObj = map;
    google.maps.event.addListener(map, "idle", debounce(() => mapQuery(true))) // Add listener for when map idles on page

}

/* Old Map Query using POST
async function mapQuery(mapObj, bounded) {
    var bounds = {};
    if (bounded) {
        bounds = await mapBounds(mapObj)
        console.log("Query--- ne: (lat: " + bounds["ne"]["lat"] + ", lng: " + bounds["ne"]["lng"] + ") sw: (lat: " + bounds["sw"]["lat"] + ", lng: " + bounds["sw"]["lng"] + ")")
    } else {
        console.log("Query--- All")
    }
    clearFeatures(features);
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
*/

const mapwsSocketUrl = 'ws://localhost:3000/mapws/'
const mapSocket = new WebSocket(mapwsSocketUrl);

mapSocket.onopen = () => {
  console.log('Websocket Opened'); 
}

mapSocket.onmessage = (message) => {
    console.log('Message from server:', message.data)
    var responseGeoJSON = JSON.parse(message.data);
    console.log(responseGeoJSON);
    features = mapObj.data.addGeoJson(responseGeoJSON);
}

async function mapQuery(bounded) {
    var bounds = {};
    if (bounded) {
        bounds = await mapBounds(mapObj)
        console.log("Query--- ne: (lat: " + bounds["ne"]["lat"] + ", lng: " + bounds["ne"]["lng"] + ") sw: (lat: " + bounds["sw"]["lat"] + ", lng: " + bounds["sw"]["lng"] + ")")
    } else {
        console.log("Query--- All")
    }
    clearFeatures(features);

    mapSocket.send(JSON.stringify({
        "bounds": bounds,
        "county": county
    }))
}


function debounce(func, timeout = 100){
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