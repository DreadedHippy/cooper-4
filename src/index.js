// Convert all lines below this (and after) to ESM
require = require("esm")(module);

// Bootstrap the client with ESM.
import bootstrap from './bot/core/bootstrap';
bootstrap();

import express from 'express';

const app = express()
const port = 3000

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(process.env.PORT, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})