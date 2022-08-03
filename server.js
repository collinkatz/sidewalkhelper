// Imports
const express = require('express');
// const expressLayouts = require('express-ejs-layouts');
const { spawn } = require('node:child_process');

// Variables
var queryCount = 0;

// Start up app
const app = express();
const port = 3000;

// Set up static directorys to serve static data
app.use(express.static('./src/public'));

// Set view engine to load pages
// app.use(expressLayouts)
app.set('views', './src/views');
// app.set('layout', './src/layouts/main.ejs')
app.set('view engine', 'ejs');

// Page listeners
app.get('/', (req, res) => {
  res.render('index', {title: 'Map', layout: ''});
});

app.get('/queryCountyData', (req, res) => {
  queryCount++;
  myQID = queryCount;
  myCounty = req.query.county;
  var process = spawn('python', ['./dataQuery.py', myQID, req.query.northEast, req.query.southWest, myCounty]);
  process.stdout.on('data', function(data) {
    if (data.startsWith('query: ' + myQID)) {
      var myGeoJSONFile = require('./query_output/' + myQID + '_' + myCounty + '.json');
      res.json(myGeoJSONFile);
    }
  });
});

// Start listening
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
