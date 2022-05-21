// @ts-ignore
import mysql from 'mysql';
import {
  DBRowT,
  DovFirmI,
  DovTovI, InsertionResI,
  PreyskurantI,
  QueryDBResI,
  QueryError,
  QueryResI,
  RealTovI, UserDataI
} from '../types/sqlTypes/SQLTypes';
import CONFIG from '../config/config';

let connected = false;
// export let con = mysql.createConnection({
//   host: CONFIG.DB.HOST,
//   user: CONFIG.DB.USER,
//   password: CONFIG.DB.PASSWORD,
//   database: CONFIG.DB.DATABASE,
// });

type DBRow = DovTovI | DovFirmI | PreyskurantI | RealTovI;

export let con = mysql.createPool({
  host: CONFIG.DB.HOST,
  user: CONFIG.DB.USER,
  password: CONFIG.DB.PASSWORD,
  database: CONFIG.DB.DATABASE,
  timezone: 'utc'
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

export const getAllTables = async (tablesNamesList?: string[]): Promise<QueryDBResI> => {
  let tablesList = '';
  if (tablesNamesList) {
    tablesList = ` AND (${ tablesNamesList.map(tn => { return `TABLE_NAME = '${tn}'` }).join(' or ') })`
  }
  const query = `SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_TYPE=\'BASE TABLE\' AND TABLE_SCHEMA='${CONFIG.DB.DATABASE}'${tablesList}`;
  return await queryDB(query);
};


export const getTableFields = async (name: string): Promise<QueryDBResI> => {
  const query = `SELECT * FROM ${name}`;
  return await queryDB(query);
};

export const insertElement = async (name: string, element: DBRow): Promise<QueryDBResI> => {
  let fields: string[] = [], values: any[] = [];
  Object.entries(element).forEach(([key, value]) => {
    fields.push(key);
    if (typeof value === "string" && value[0] !== "\"") {
      values.push(`'${value}'`);
    } else values.push(value);
  });
  const query = `INSERT INTO ${name} (${fields.join(', ')}) VALUES (${values.join(', ')})`;
  return await queryDB(query);
};

export const updateElement = async (name: string, prevElement: DBRow, element: DBRow): Promise<QueryDBResI> => {
  let fields: string[] = [], prevFields: string[] = [];
  Object.entries(element).forEach(([key, value]) => {
    fields.push(`\`${key}\` = '${value}'`);
  });
  Object.entries(prevElement).forEach(([key, value]) => {
    prevFields.push(`(\`${key}\` = '${value}')`);
  });
  const query = `UPDATE ${name} SET ${fields.join(', ')} WHERE ${prevFields.join(' and ')}`;
  return await queryDB(query);
};

export const deleteElement = async (name: string, element: DBRow): Promise<QueryDBResI> => {
  let fields: string[] = [];
  Object.entries(element).forEach(([key, value]) => {
    fields.push(`(\`${key}\` = '${value}')`);
  });
  const query = `DELETE FROM ${name} WHERE ${fields.join(' and ')}`;
  return await queryDB(query);
};

export const getUser = async (name: string): Promise<UserDataI | null> => {
  const query = `SELECT * FROM users WHERE name = '${name}'`;
  const response = await queryDB(query);
  //  @ts-ignore
  return response.body[0] || null;
}

export const createUser = async (user: UserDataI): Promise<QueryDBResI> => {
  let fields: string[] = [], values: any[] = [];
  Object.entries(user).forEach(([key, value]) => {
    fields.push(key);
    values.push(`'${value}'`);
  });
  const query = `INSERT INTO users (${fields.join(', ')}) VALUES (${values.join(', ')})`;
  return await queryDB(query);
};

// export const getMostSamsumgEpsonDists = async (distName: string): Promise<QueryDBResI> => {
//   const query = `CALL GetMostEpsonSamsungDists('${distName}')`;
//   return await queryDB(query);
// };