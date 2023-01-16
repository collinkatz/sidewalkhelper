const app = require("./http-server").app;
const port = require("./http-server").port;
const expressWs = require('express-ws');

const { spawn, exec } = require('node:child_process');
const path = require('node:path');

expressWs(app)

// Variables
var queryCount = 0;
const chunksEnabled = false;

app.ws('/mapws', (ws, req) => {
  
  ws.on('open', () => {
    console.log('WebSocket was opened');
  });

  ws.on('close', () => {
    console.log('WebSocket was closed');
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
      
      if (chunksEnabled) { // TODO: Move chunking into SHPQuery now that there is async output so server doesn't need to spawn a million processes
        // var chunkingProcess = exec(`python ./dataQuery.py getChunks ${bounds}`, (error, stdout, stderr) => {
        //   var chunks = JSON.parse(stdout);
        //   // TODO cancel process if new query comes in
        //   // Spawn python subprocess to make queried file
        //   chunks.forEach((currChunk) => {
        //     console.log(currChunk);
        //     currChunk = JSON.stringify(currChunk).replaceAll('\"', "\'")
            runScriptSendWS('python', ["-u", "dataQuery.py", myQID, bounds, county, chunksEnabled], ws);
        //   })
        // });
      } else {
        runScriptSendWS('python', ["-u", "dataQuery.py", myQID, bounds, county, chunksEnabled], ws); // https://stackoverflow.com/a/56138420/20891092 Insane amount of time spent figuring out it needed a -u credit to Nadav Har'El
      }
    } catch(e) {
      console.log(e);
    }

  });

});

async function runScriptSendWS(command, args, ws) {
  var child = spawn(command, args);

  child.stdout.setEncoding('utf8');

  child.stdout.on("data", (data) => {
    console.log('stdout: ' + data);
    ws.send(data);
  });

  child.stderr.on("data", (data) => {
    console.log('stderr: ' + data);
  });

  child.on('error', (err) => {
    console.log("Failed to start child.", err);
  });

}

app.listen(port);