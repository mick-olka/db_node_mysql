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
exports.getTableFields = exports.getAllTables = exports.connectToDB = exports.con = void 0;
// @ts-ignore
const mysql_1 = require("mysql");
const config_1 = require("../config/config");
let connected = false;
exports.con = mysql_1.default.createConnection({
    host: config_1.default.DB.HOST,
    user: config_1.default.DB.USER,
    password: config_1.default.DB.PASSWORD,
    database: config_1.default.DB.DATABASE,
});
/**
 * Connect to mysql db.
 *
 * @returns {boolean}
 */
const connectToDB = () => {
    exports.con.connect((err) => {
        if (err) {
            connected = false;
            throw err;
        }
        console.log('Connected!!!');
        connected = true;
    });
};
exports.connectToDB = connectToDB;
const queryDB = (query) => __awaiter(void 0, void 0, void 0, function* () {
    return new Promise((resolve, reject) => {
        if (connected) {
            exports.con.query(query, (err, result, fields) => {
                if (err) {
                    return reject({ data: null, err: err });
                }
                return resolve({ data: result, err: null });
            });
        }
        else {
            return reject({
                data: null,
                err: { sqlMessage: 'Not Connected or script Error' },
            });
        }
    });
});
const getAllTables = () => __awaiter(void 0, void 0, void 0, function* () {
    const query = `SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_TYPE=\'BASE TABLE\' AND TABLE_SCHEMA='${config_1.default.DB.DATABASE}'`;
    return yield queryDB(query);
});
exports.getAllTables = getAllTables;
const getTableFields = (name) => __awaiter(void 0, void 0, void 0, function* () {
    const query = `SELECT * FROM ${name}`;
    return yield queryDB(query);
});
exports.getTableFields = getTableFields;
