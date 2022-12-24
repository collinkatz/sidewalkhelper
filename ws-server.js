const app = require("./http-server").app;
const port = require("./http-server").port;
const expressWs = require('express-ws');
const fs = require('fs');

const { spawn } = require('node:child_process');
const { unlink } = require('node:fs');
const path = require('node:path');

expressWs(app)

// Variables
var queryCount = 0;

app.ws('/mapws', (ws, req) => {
  ws.on('connect', () => {
    console.log('WebSocket was opened')
  });

  ws.on('close', () => {
      console.log('WebSocket was closed')
  });

  ws.on('message', (msg) => { // This contains similar POST request code

    console.log(msg);

    try {
      msg = JSON.parse(msg);
      // Parse request and update query count
      bounds = JSON.stringify(msg['bounds']).replaceAll('\"', "\'"); // Need to replace double quotes with single for command line input
      county = msg['county'];
      queryCount++;
      myQID = queryCount;
      //TODO cancel process if new query comes in
      // Spawn python subprocess to make queried file
      var process = spawn('python', ['./dataQuery.py', myQID, bounds, county], {shell: true});
      console.log("spawned process")
      process.stderr.on('data', (data) => { // Outputs errors to command line
        console.log(String(data))
      });

      // When process outputs send file and then remove queried json
      process.stdout.on('data', (data) => { // Called when python query outputs exit status
        console.log(String(data))
        var myGeoJSONFile = './query_output/' + myQID + '_' + county + '.json';
        var geoJSONData = fs.readFileSync(myGeoJSONFile, 'utf8');
        // JSON.parse(rawdata);
        // ERROR HERE need to use ws.emit instead of res.sendFile
        ws.send(geoJSONData);
        // res.on('finish', () => { // Finish used to delete file after successfully sending
        //   try {
        //     unlink(myGeoJSONFile, () => {console.log("Deleted query json")}); 
        //   } catch(e) {
        //     console.log("error removing ", myGeoJSONFile);
        //   }
        // });
        // console.log(myGeoJSONFile);
      });
    } catch(e) {
      console.log(e);
    }

  });

})

app.listen(port);