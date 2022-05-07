// @ts-ignore
import mysql from 'mysql';
import {
  DovFirmI,
  DovTovI, InsertionResI,
  PreyskurantI,
  QueryDBResI,
  QueryError,
  QueryResI,
  RealTovI
} from '../types/sqlTypes/SQLTypes';
import CONFIG from '../config/config';

let connected = false;
// export let con = mysql.createConnection({
//   host: CONFIG.DB.HOST,
//   user: CONFIG.DB.USER,
//   password: CONFIG.DB.PASSWORD,
//   database: CONFIG.DB.DATABASE,
// });

export let con = mysql.createPool({
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
  con.getConnection((err: Error) => {
    if (err) {
      connected = false;
      throw err;
    }
    console.log('Connected!!!');
    connected = true;
  });
};

const queryDB = async (query: string): Promise<QueryDBResI> => {
  return new Promise((resolve, reject) => {
    if (connected) {
      con.query(query, (err: QueryError, result: any, fields: any) => {
        if (err) {
          return reject(err);
        }
        return resolve({body: result, fields: fields, err: null});
      });
    } else {
      return reject({ sqlMessage: 'Not Connected or script Error' });
    }
  });
};

export const getAllTables = async (): Promise<QueryDBResI> => {
  const query = `SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_TYPE=\'BASE TABLE\' AND TABLE_SCHEMA='${CONFIG.DB.DATABASE}'`;
  return await queryDB(query);
};

export const getTableFields = async (name: string): Promise<QueryDBResI> => {
  const query = `SELECT * FROM ${name}`;
  return await queryDB(query);
};

export const insertElement = async (name: string, element: DovTovI | DovFirmI | PreyskurantI | RealTovI): Promise<QueryDBResI> => {
  let fields: string[] = [], values: any[] = [];
  console.log(element);
  Object.entries(element).forEach(entr => {
    fields.push(entr[0]);
    if (typeof entr[1] === "string" && entr[1][0] !== "\"") {
      values.push(`'${entr[1]}'`);
    } else values.push(entr[1]);
  });
  const query = `INSERT INTO ${name} (${fields.join(', ')}) VALUES (${values.join(', ')})`;
  return await queryDB(query);
};
