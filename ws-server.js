const app = require("./http-server").app;
const port = require("./http-server").port;
const { time } = require("console");
const expressWs = require('express-ws');
const fs = require('fs');

const { exec } = require('node:child_process');
const { unlink } = require('node:fs');
const path = require('node:path');

expressWs(app)

// Variables
var queryCount = 0;
const chunksEnabled = false;

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
      
      if (chunksEnabled) {
        var chunkingProcess = exec(`python ./dataQuery.py getChunks ${bounds}`, (error, stdout, stderr) => {
          var chunks = JSON.parse(stdout);
          // TODO cancel process if new query comes in
          // Spawn python subprocess to make queried file
          // console.log(`python ./dataQuery.py ${myQID} ${bounds} ${county}`);
          chunks.forEach((currChunk) => {
            console.log(currChunk);
            currChunk = JSON.stringify(currChunk).replaceAll('\"', "\'")
            var queryProcess = exec(`python ./dataQuery.py ${myQID} ${currChunk} ${county}`, (error, stdout, stderr) => {
              // console.log(stdout);
              ws.send(stdout);
            });
          })
        });
      } else {
        var queryProcess = exec(`python ./dataQuery.py ${myQID} ${bounds} ${county}`, (error, stdout, stderr) => {
          ws.send(stdout);
        });
      }
    } catch(e) {
      console.log(e);
    }

  });

})

app.listen(port);