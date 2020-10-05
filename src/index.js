// Convert all lines below this (and after) to ESM
require = require("esm")(module);

// Bootstrap the client
const bootstrap = require('./bot/core/bootstrap');

// After bootstrap IMPORT/EXPORT (ESM) will function.
bootstrap();