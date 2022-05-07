import { Request, Response } from 'express';
import * as dbService from '../service/database';

//  routes controllers

export const  getTable = async (req: Request, res: Response): Promise<void> => {
  let dbName = req.params.name;
  try {
    const response = await dbService.getTableFields(dbName);
    res.status(200).json({table: response, err: null});
  } catch (e) {
    res.status(500).json({table: null, err: e});
  }
};

export const getAllTables = async (req: Request, res: Response): Promise<void> => {
  try {
    const response = await dbService.getAllTables();
    res.status(200).json({table: response, err: null});
  } catch (e) {
    res.status(500).json({table: null, err: e});
  }
};

export const insertInTable = async (req: Request, res: Response): Promise<void> => {
  try {
    let dbName = req.params.name;
    const response = await dbService.insertElement(dbName, req.body.element);
    res.status(200).json({result: response, err: null});
  } catch (e) {
    res.status(500).json({result: null, err: e});
  }
};