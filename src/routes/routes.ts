import { Router } from 'express';
import * as homeController from '../controller/home';
import * as dbController from '../controller/db_req_controllers';
import * as pagesController from '../controller/pages';
import {checkAuth} from "../middlewares/auth";

const router = Router();

router.get('/', homeController.getAppInfo);
//  { NAME: 'te', VERSION: '1.0.0' };

router.get('/index', homeController.getMainPage);
//  { title: 'Index' }

router.get('/db/all', dbController.getAllTables);
//  {table: Result | null, err: e | null}
//  Result {body: DBRowT[], fields: FieldInfoI[], err: any}

router.post('/db/all', dbController.getAllTables);
//  {table: Result | null, err: e | null}
//  Result {body: DBRowT[], fields: FieldInfoI[], err: any}

router.get('/db/:name', dbController.getTable);
//  {table: Result | null, err: e | null}
//  Result {body: DBRowT[], fields: FieldInfoI[], err: any}

router.put('/db/:name', checkAuth, dbController.insertInTable);
//  {table: Result | null, err: e | null}
//  Result {body: DBRowT[], fields: FieldInfoI[], err: any}

router.patch('/db/:name', checkAuth, dbController.updateRowInTable);
//  {table: Result | null, err: e | null}
//  Result {body: DBRowT[], fields: FieldInfoI[], err: any}

router.post('/db/:name', checkAuth, dbController.deleteRowInTable);
//  {table: Result | null, err: e | null}
//  Result {body: DBRowT[], fields: FieldInfoI[], err: any}

router.post('/user/register', dbController.registerUser);
//  {msg: "User Registered" | "error", code: 0 | 1, user: User, err: null | err}
//  User { name: string, email: string, status: 0 | 1 | 2 | 3 }

router.post('/user/login', dbController.loginUser);
//  {msg: "User Logged" | "error", code: 0 | 1, user: User, err: null | any}
//  User { name: string, email: string, status: 0 | 1 | 2 | 3 }

router.get('/auth', checkAuth, dbController.checkAuth);
//  {code: 0 | 1, msg: 'success' | 'not auth', user?: User }


// ====== PAGES ===========

router.get('/db/page/:name', pagesController.getTablePage);

export default router;