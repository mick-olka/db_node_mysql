import { Request, Response } from 'express';
import * as dbService from '../service/database';

//  routes controllers

export const getTable = async (req: Request, res: Response): Promise<void> => {
  let dbName = req.params.name;
  try {
    const result = await dbService.getTableFields(dbName);
    res.status(200).json({data: {result, name: dbName}, err: null});
  } catch (e) {
    res.status(500).json({data: null, err: e});
  }
};

export const getAllTables = async (req: Request, res: Response): Promise<void> => {
  try {
    const result = await dbService.getAllTables();
    res.status(200).json({data: result, err: null});
  } catch (e) {
    res.status(500).json({data: null, err: e});
  }
};
