import { Request, Response } from 'express';
import * as dbService from '../service/database';
import bcrypt from "bcrypt";
import {UserDataI} from "../types/sqlTypes/SQLTypes";
import jwt from "jsonwebtoken";
import CONFIG from "../config/config";
import {getUser} from "../service/database";

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
  const salt = await bcrypt.genSalt(10);
  const hashPassword = await bcrypt.hash(userData.password, salt);
  delete userData.password;
  const newUser: UserDataI = { ...userData, code: hashPassword, status: 3 }
  try {
    const response = await dbService.createUser(newUser);
    if (!response.err) {
      // @ts-ignore
      token = jwt.sign({name: userData.name, status: userData.status || 3 }, CONFIG.TOKEN_SECRET, { expiresIn: '1d' });
    }
    res.status(200).json({msg: token, code: 0, user: {name: newUser.name, email: newUser.email, status: newUser.status || 3}, err: null});
  } catch (e) {
    res.status(500).json({msg: "Error Registering User", code: 1, user: null, err: e});
  }
};

export const loginUser = async (req: Request, res: Response): Promise<void> => {
  const { name, password } = req.body.user;
  const user = await dbService.getUser(name);
  if (user) {
    const validPass = await bcrypt.compare(password, user.code);
    if (validPass) {
      // Create and assign token
      // @ts-ignore
      const token = jwt.sign({name: user.name, status: user.status }, CONFIG.TOKEN_SECRET, { expiresIn: '1d' });
      res.header("auth-token", token);
      res.status(201).json({code: 0, msg: token, user: {name: user.name, email: user.email, status: user.status}, err: null });
    } else res.status(400).json({code: 1, msg: "Name or Password is wrong", user: null, err: "Name or Password is wrong"});
  } else {
    res.status(404).json({code: 1, msg: "No such user", user: null});
  }
}

export const checkAuth = async (req: Request, res: Response): Promise<void> => {
  if (req.headers.token) {
    res.status(201).json({code: 0, msg: 'success', user: req.body.user});
  } else {
    res.status(401).json({code: 1, msg: 'not authorised'});
  }
}

// export const  getMostSamsumgEpsonDists = async (req: Request, res: Response): Promise<void> => {
//   let distName = req.params.distName;
//   try {
//     const response = await dbService.getMostSamsumgEpsonDists(distName);
//     res.status(200).json({table: response, err: null});
//   } catch (e) {
//     res.status(500).json({table: null, err: e});
//   }
// };