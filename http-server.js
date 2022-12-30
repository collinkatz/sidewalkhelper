// Imports
const express = require('express');
const { spawn } = require('node:child_process');
const { unlink } = require('node:fs');
const path = require('node:path');

// Variables
var queryCount = 0;

// Start up app
const app = express();
const port = process.env.port || 3000;

app.use(express.static('./src/public')); // Set up static directorys to serve static data
app.use(express.urlencoded({ extended: true })); // Set up body-parser middleware
app.use(express.json());

// Set view engine to load pages
app.set('views', './src/views');
app.set('view engine', 'ejs');

// Page listeners loads home page
app.get('/', (req, res) => {
  res.render('index', {title: 'Map', layout: ''});
  
});

// app.post('/queryCountyData', (req, res) => {
//   try {
//     // Parse request and update query count
//     queryCount++;
//     myQID = queryCount;
//     bounds = JSON.stringify(req.body['bounds']).replaceAll('\"', "\'"); // Need to replace double quotes with single for command line input
//     county = req.body['county'];

//     var queryProcess = exec(`python ./dataQuery.py ${myQID} ${bounds} ${county}`, (error, stdout, stderr) => {
//       res.send(stdout);
//     });
//   } catch(e) {
//     console.log(e);
//   }
// });

// Start listening
// app.listen(port, () => {
//   console.log(`Example app listening on port ${port}`);
// });

module.exports = { app, port };