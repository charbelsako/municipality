"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_flow_1 = require("dotenv-flow");
(0, dotenv_flow_1.config)();
console.log(process.env.MONGO_URI);
// connect to database
