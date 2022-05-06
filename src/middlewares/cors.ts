import {NextFunction, Request, Response} from "express";
import CONFIG from "../config/config";

export const headersOptions = (req: Request, res: Response, next: NextFunction) => {
    const corsWhiteList = CONFIG.APP.CORS_LIST;
    const origin=req.headers.origin;
    if (corsWhiteList.includes(<string>origin)) {
        res.header('Access-Control-Allow-Origin', origin);
    }
    res.header('Access-Control-Allow-Credentials', "true");
    res.header('Content-Type', 'application/json');
    res.header('Access-Control-Allow-Headers', "*");
    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
        return res.status(200).json({options: "options"});
    }
    next();
}