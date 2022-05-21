import {Request, Response} from 'express';
import * as dbService from '../service/database';
import bcrypt from "bcrypt";
import {UserDataI} from "../types/sqlTypes/SQLTypes";
import jwt from "jsonwebtoken";
import CONFIG from "../config/config";
import {getUser} from "../service/database";

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