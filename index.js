"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const dotenv_1 = require("dotenv");
const path_1 = require("path");
const morgan_1 = require("morgan");
const errorHandler_1 = require("./src/middlewares/errorHandler");
const main_1 = require("./src/routes/main");
const cors_1 = require("./src/middlewares/cors");
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.PORT;
app.use((0, morgan_1.default)('dev')); //  logging
app.use(express_1.default.static(path_1.default.join(__dirname, 'public')));
app.use(express_1.default.json()); //  expects request data to be sent in JSON format, which often resembles a simple JS object
app.use(express_1.default.urlencoded({ extended: true })); //  expects request data to be sent encoded in the URL, usually in strings or arrays
app.use(cors_1.headersOptions);
app.use('/', main_1.default);
// Error Middleware
app.use(errorHandler_1.genericErrorHandler);
app.use(errorHandler_1.notFoundError);
app.listen(port, () => {
    console.log(`⚡️[server]: Running at http://localhost:${port}`);
});
