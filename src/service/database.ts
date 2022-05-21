// @ts-ignore
import mysql from 'mysql2';
import {
  DovFirmI,
  DovTovI,
  PreyskurantI,
  QueryDBResI,
  QueryError,
  RealTovI, UserDataI
} from '../types/sqlTypes/SQLTypes';
import CONFIG from '../config/config';

// export let con = mysql.createConnection({
//   host: CONFIG.DB.HOST,
//   user: CONFIG.DB.USER,
//   password: CONFIG.DB.PASSWORD,
//   database: CONFIG.DB.DATABASE,
// });

const handleErrorMessage = (e: QueryError) => {
  if (e.errno === 1045 || e.errno === 1251) return 'Wrong Credentials';
  if (e.errno === 1396) return 'User already exists or user data invalid';
  return e.sqlMessage;
}

type DBRow = DovTovI | DovFirmI | PreyskurantI | RealTovI;

export let pool: any = null;

export const connectToDB = async (name: string, pwd: string): Promise<{ success: boolean, err: any }> => {
  try {
    pool = mysql.createPool({
      host: CONFIG.DB.HOST,
      user: name,
      password: pwd,
      database: CONFIG.DB.DATABASE,
      timezone: 'utc'
    });
    await getUser(name);
    return {success: true, err: null}
  } catch (e) {
    return {success: false, err: e}
  }
};

const queryDB = async (query: string): Promise<QueryDBResI> => {
  return new Promise((resolve, reject) => {
    pool.query(query, (err: QueryError, result: any, fields: any) => {
      if (err) {
        console.log(err);
        return reject(handleErrorMessage(err));
      }
      return resolve({body: result, fields: fields, err: null});
    });
  });
};

export const getAllTables = async (tablesNamesList?: string[]): Promise<QueryDBResI> => {
  let tablesList = '';
  if (tablesNamesList) {
    tablesList = ` AND (${tablesNamesList.map(tn => {
      return `TABLE_NAME = '${tn}'`
    }).join(' or ')})`
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
  const query = `SELECT * FROM mysql.user WHERE User = '${name}'`;
  const response = await queryDB(query);
  //  @ts-ignore
  return response.body[0] || null;
}

export const createUser = async (name: string, pwd: string): Promise<QueryDBResI> => {
  const query = `CREATE USER '${name}'@'%' IDENTIFIED BY '${pwd}'`;
  return await queryDB(query);
};

export const grantUser = async (user: string) => {
  const query = `GRANT INSERT, DELETE, UPDATE ON ${CONFIG.DB.DATABASE}.* TO '${user}'@'%'`;
  return await queryDB(query);
}

// export const getMostSamsumgEpsonDists = async (distName: string): Promise<QueryDBResI> => {
//   const query = `CALL GetMostEpsonSamsungDists('${distName}')`;
//   return await queryDB(query);
// };