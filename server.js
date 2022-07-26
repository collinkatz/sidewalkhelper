// Imports
const express = require('express')
const expressLayouts = require('express-ejs-layouts')

// Start up app
const app = express()
const port = 3000

// Set view engine to load pages
app.use(expressLayouts)
app.set('views', './src/views');
app.set('view engine', 'ejs')

// Page listeners
app.get('/', (req, res) => {
  res.render('index.ejs')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
