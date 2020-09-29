// Convert all lines below this (and after) to ESM
require = require("esm")(module);

import setup from './bot/core/setup';
setup();