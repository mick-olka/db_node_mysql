"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const homeController = require("../controller/home");
const dbController = require("../controller/sql_requests");
const router = (0, express_1.Router)();
router.get('/', homeController.getAppInfo);
router.get('/index', homeController.getMainPage);
router.get('/db/all', dbController.getAllTables);
exports.default = router;