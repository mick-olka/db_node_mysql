import { Request, Response } from 'express';
import * as dbService from '../service/database';

//  routes controllers

export const getTablePage = async (req: Request, res: Response): Promise<void> => {
  const dbName = req.params.name;
  const result = await dbService.getTableFields(dbName);
  res.setHeader('Content-Type', 'text/html');
  if (result.err) {
    console.log(result.err);
    res.render('error', { message: result.err.sqlMessage });
  } else {
    const fields: Array<string> = [];
    for (const [key, value] of Object.entries(result.data[0])) {
      fields.push(key);
    }
    const data = Object.values(JSON.parse(JSON.stringify(result.data)));
    res.render('table_fields', { fields: fields, data: data });
  }
};

export const getAllTablesPage = async (req: Request, res: Response): Promise<void> => {
  const result = await dbService.getAllTables();
  if (result.err) {
    console.log(result.err);
    res.status(500).json(result);
  } else res.status(200).json(result);
};
