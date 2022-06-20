import {Request, Response} from 'express';
import * as dbService from '../service/database';
import jwt from "jsonwebtoken";
import CONFIG from "../config/config";
import {getUser, pool} from "../service/database";
import {escape_string, validateDate} from "../utils/_utils";
import mysql from "mysql2";

//  routes controllers

export const getTable = async (req: Request, res: Response): Promise<void> => {
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
    const response = await dbService.getAllTables(req.body.tablesList as string[] || null);
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

export const updateRowInTable = async (req: Request, res: Response): Promise<void> => {
  try {
    let dbName = req.params.name;
    const response = await dbService.updateElement(dbName, req.body.element, req.body.prevElement);
    res.status(200).json({result: response, err: null});
  } catch (e) {
    res.status(500).json({result: null, err: e});
  }
};

export const deleteRowInTable = async (req: Request, res: Response): Promise<void> => {
  try {
    let dbName = req.params.name;
    const response = await dbService.deleteElement(dbName, req.body.element);
    res.status(200).json({result: response, err: null});
  } catch (e) {
    res.status(500).json({result: null, err: e});
  }
};

export const registerUser = async (req: Request, res: Response): Promise<void> => {
  const userData = req.body.user;
  let token: null | string = null;
  try {
    await dbService.connectToDB('dev', 'dev');
    const response = await dbService.createUser(userData.name, userData.password);
    await dbService.grantUser(userData.name);
    token = jwt.sign({name: userData.name}, CONFIG.TOKEN_SECRET || 'token+secret', {expiresIn: '1d'});
    res.status(200).json({msg: token, code: 0, user: response.body});
  } catch (e) {
    res.status(500).json({msg: e, code: 1, user: null});
  }
};

export const loginUser = async (req: Request, res: Response): Promise<void> => {
  const {name, password} = req.body.user;
  const user = await dbService.connectToDB(name, password);
  if (user.success) {
    const token = jwt.sign({name: name}, CONFIG.TOKEN_SECRET || 'token+secret', {expiresIn: '1d'});
    res.header("auth-token", token);
    res.status(201).json({code: 0, msg: token, user: {name: name}});
  } else res.status(400).json({
    code: 1,
    msg: "Name or Password is wrong",
    user: null
  });
}

export const checkAuth = async (req: Request, res: Response): Promise<void> => {
  if (req.headers.token) {
    const payload = jwt.verify(req.headers.token as string, CONFIG.TOKEN_SECRET || 'token+secret');
    // @ts-ignore
    console.log(await getUser(payload.name));
    res.status(201).json({code: 0, msg: 'success', user: req.body.user});
  } else {
    res.status(401).json({code: 1, msg: 'not authorised'});
  }
}

export const get1_4 = async (req: Request, res: Response): Promise<void> => {
  let fromDate = req.query.fromDate as string;
  let toDate = req.query.toDate as string;
  try {
    if (validateDate(fromDate) && validateDate(toDate)) {
      const resp = await dbService.get1_4(fromDate, toDate);
      // @ts-ignore
      res.status(200).json({table: {body: resp.body[2], fields: resp.fields[2]}, err: null});
    } else {
      res.status(500).json({table: null, err: 'Invalid params - wrong date'});
    }
  } catch (e: any) {
    console.log(e);
    res.status(500).json({table: null, err: e.toString()});
  }
}

export const get1_6 = async (req: Request, res: Response): Promise<void> => {
  let daysCount = parseInt(req.query.daysCount as string);
  try {
    if (daysCount) {
      const resp = await dbService.get1_6(daysCount);
      // @ts-ignore
      res.status(200).json({table: {body: resp.body[1], fields: resp.fields[1]}, err: null});
    } else {
      res.status(500).json({table: null, err: 'Invalid params - wrong input'});
    }
  } catch (e: any) {
    console.log(e);
    res.status(500).json({table: null, err: e.toString()});
  }
}

export const get2_1 = async (req: Request, res: Response): Promise<void> => {
  let name = escape_string(req.query.name as string);
  try {
    if (name) {
      const resp = await dbService.get2_1(name);
      // @ts-ignore
      res.status(200).json({table: {body: resp.body[0], fields: resp.fields[0]}, err: null});
    } else {
      res.status(500).json({table: null, err: 'Invalid params - wrong name'});
    }
  } catch (e: any) {
    console.log(e);
    res.status(500).json({table: null, err: e.toString()});
  }
}

export const get2_2 = async (req: Request, res: Response): Promise<void> => {
  let month = parseInt(req.query.month as string);
  let year = parseInt(req.query.year as string);
  try {
    if (month && year) {
      const resp = await dbService.get2_2(month, year);
      // @ts-ignore
      res.status(200).json({table: {body: resp.body[0], fields: resp.fields[0]}, err: null});
    } else {
      res.status(500).json({table: null, err: 'Invalid params - wrong date'});
    }
  } catch (e: any) {
    console.log(e);
    res.status(500).json({table: null, err: e.toString()});
  }
}