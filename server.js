// Imports
const express = require('express');
const { spawn, exec, execFile } = require('node:child_process');
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
  queryCount++;
  myQID = queryCount;
  bounds = JSON.stringify(req.body['bounds']).replaceAll('\"', "\'"); // Need to replace double quotes with single for command line input
  county = req.body['county'];

  var process = spawn('python', ['./dataQuery.py', myQID, bounds, county], {shell: true});
  console.log("spawned process")
  process.stderr.on('data', (data) => {
    console.log(String(data))
  });
  process.stdout.on('data', (data) => {
    console.log(String(data))
    var myGeoJSONFile = './query_output/' + myQID + '_' + county + '.json';
    res.sendFile(myGeoJSONFile, {root: path.join(__dirname)});
    console.log(myGeoJSONFile);
  });
});

// Start listening
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
