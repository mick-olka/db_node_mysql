"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.headersOptions = void 0;
const config_1 = require("../config/config");
const headersOptions = (req, res, next) => {
    const corsWhiteList = config_1.default.APP.CORS_LIST;
    const origin = req.headers.origin;
    if (corsWhiteList.includes(origin)) {
        res.header('Access-Control-Allow-Origin', origin);
    }
    res.header('Access-Control-Allow-Credentials', "true");
    res.header('Content-Type', 'application/json');
    res.header('Access-Control-Allow-Headers', "*");
    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
        return res.status(200).json({ options: "options" });
    }
    next();
};
exports.headersOptions = headersOptions;
