"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllTables = exports.getTable = void 0;
const dbService = require("../service/database");
//  routes controllers
const getTable = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let dbName = req.params.name;
    const result = yield dbService.getTableFields(dbName);
    if (result.err) {
        console.log(result.err);
        res.status(500).json(result);
    }
    else
        res.status(200).json(result);
});
exports.getTable = getTable;
const getAllTables = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield dbService.getAllTables();
    if (result.err) {
        console.log(result.err);
        res.status(500).json(result);
    }
    else
        res.status(200).json(result);
});
exports.getAllTables = getAllTables;
