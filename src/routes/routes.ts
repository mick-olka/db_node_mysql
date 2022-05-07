import { Router } from 'express';
import * as homeController from '../controller/home';
import * as dbController from '../controller/sql_requests';
import * as pagesController from '../controller/pages';

const router = Router();

router.get('/', homeController.getAppInfo);

router.get('/index', homeController.getMainPage);

router.get('/db/all', dbController.getAllTables);

router.get('/db/:name', dbController.getTable);

router.put('/db/:name', dbController.insertInTable);

// ====== PAGES ===========

router.get('/db/page/:name', pagesController.getTablePage);

export default router;