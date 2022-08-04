// Imports
const express = require('express');
const { spawn } = require('node:child_process');

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
  console.log(req.body)
  queryCount++;
  myQID = queryCount;
  ne = req.body['ne'];
  sw = req.body['sw'];
  county = req.body['county'];
  var process = spawn('python3', ['./dataQuery.py', myQID, ne, sw, county]);
  console.log("spawned process")
  process.stderr.pipe(process.stderr);
  process.stdout.on('data', function(data) {
    var myGeoJSONFile = require('./query_output/' + myQID + '_' + county + '.json');
    res.json(myGeoJSONFile);
    console.log(myGeoJSONFile)
  });
});

// Start listening
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
