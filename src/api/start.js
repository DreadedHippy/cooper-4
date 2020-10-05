// Convert all lines below this (and after) to ESM
// require = require("esm")(module);

const express = require('express');

const app = express()

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(process.env.PORT, () => {
  console.log(`Example app listening at http://localhost:${process.env.PORT}`)
})