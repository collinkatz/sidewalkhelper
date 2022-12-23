var features = {};

async function initMap(county) { // Setup map and event listeners

    map = new google.maps.Map(document.getElementById("map"), {
        center: { lat: 39.29360, lng: -76.81646 }, // TODO: need to change these to update based on user location
        zoom: 16,
    });

    google.maps.event.addListener(map, "idle", debounce(() => mapQuery(map, true))) // Add listener for when map idles on page

}

/* Old Map Query
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
const socket = new WebSocket(mapwsSocketUrl);

socket.onopen = () => {
  socket.send('Here\'s some text that the server is urgently awaiting!'); 
}

socket.onmessage = e => {
  console.log('Message from server:', event.data)
}

async function mapQuery(mapObj, bounded) {
    var bounds = {};
    if (bounded) {
        bounds = await mapBounds(mapObj)
        console.log("Query--- ne: (lat: " + bounds["ne"]["lat"] + ", lng: " + bounds["ne"]["lng"] + ") sw: (lat: " + bounds["sw"]["lat"] + ", lng: " + bounds["sw"]["lng"] + ")")
    } else {
        console.log("Query--- All")
    }
    clearFeatures(features);

    socket.send(JSON.stringify({
        "bounds": bounds,
        "county": county
    }))
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