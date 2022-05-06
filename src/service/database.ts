// @ts-ignore
import mysql from 'mysql';
import { QueryCBI, QueryError, QueryResI } from '../types/sqlTypes/SQLTypes';
import CONFIG from '../config/config';

let connected = false;
export let con = mysql.createConnection({
  host: CONFIG.DB.HOST,
  user: CONFIG.DB.USER,
  password: CONFIG.DB.PASSWORD,
  database: CONFIG.DB.DATABASE,
});

/**
 * Connect to mysql db.
 *
 * @returns {boolean}
 */
export const connectToDB = () => {
  con.connect((err: Error) => {
    if (err) {
      connected = false;
      throw err;
    }
    console.log('Connected!!!');
    connected = true;
  });
};

const queryDB = async (query: string): Promise<QueryResI> => {
  return new Promise((resolve, reject) => {
    if (connected) {
      con.query(query, (err: QueryError, result: any, fields: any) => {
        if (err) {
          return reject(err);
        }
        return resolve(result);
      });
    } else {
      return reject({ sqlMessage: 'Not Connected or script Error' });
    }
  });
};

export const getAllTables = async (): Promise<QueryResI> => {
  const query = `SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_TYPE=\'BASE TABLE\' AND TABLE_SCHEMA='${CONFIG.DB.DATABASE}'`;
  return await queryDB(query);
};

export const getTableFields = async (name: string): Promise<QueryResI> => {
  const query = `SELECT * FROM ${name}`;
  return await queryDB(query);
};
