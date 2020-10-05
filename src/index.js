// Convert all lines below this (and after) to ESM
require = require("esm")(module);

// Bootstrap the client with ESM.
import bootstrap from './bot/core/bootstrap';
bootstrap();