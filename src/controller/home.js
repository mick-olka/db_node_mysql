"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMainPage = exports.getAppInfo = void 0;
const homeService = require("../service/home");
/**
 * Gets the API information.
 *
 * @param {Request} req
 * @param {Response} res
 */
const getAppInfo = (req, res) => {
    const result = homeService.getAppInfo();
    res.json(result);
};
exports.getAppInfo = getAppInfo;
const getMainPage = (req, res) => {
    //
    res.json({ title: 'Index' });
};
exports.getMainPage = getMainPage;
