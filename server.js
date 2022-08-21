// Imports
const express = require('express');
const { spawn } = require('node:child_process');
const { unlink } = require('node:fs');
const path = require('node:path');

// Variables
var queryCount = 0;

// Start up app
const app = express();
const port = 3000;

app.use(express.static('./src/public')); // Set up static directorys to serve static data
app.use(express.urlencoded({ extended: true })); // Set up body-parser middleware
app.use(express.json());

// Set view engine to load pages
app.set('views', './src/views');
app.set('view engine', 'ejs');

// Page listeners
app.get('/', (req, res) => {
  res.render('index', {title: 'Map', layout: ''});
});

app.post('/queryCountyData', (req, res) => {

  // Parse request and update query count
  queryCount++;
  myQID = queryCount;
  bounds = JSON.stringify(req.body['bounds']).replaceAll('\"', "\'"); // Need to replace double quotes with single for command line input
  county = req.body['county'];

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
    res.sendFile(myGeoJSONFile, {root: path.join(__dirname)});
    res.on('finish', () => { // Finish used to delete file after successfully sending
      try {
        unlink(myGeoJSONFile, () => {console.log("Deleted query json")}); 
      } catch(e) {
        console.log("error removing ", myGeoJSONFile); 
      }
    });
    console.log(myGeoJSONFile);
  });

});

// Start listening
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
