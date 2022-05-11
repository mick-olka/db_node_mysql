import {NextFunction, Request, Response} from "express";
import CONFIG from "../config/config";
import jwt, {Secret} from "jsonwebtoken";
import {getUser} from "../service/database";

export const checkAuth = async (req: Request, res: Response, next: NextFunction) => {
    const secret = CONFIG.TOKEN_SECRET as Secret;
    const token = req.headers.token;
    if (token?.length) {
        // @ts-ignore
        const decoded = jwt.verify(token, secret);
        //  @ts-ignore
        const user = await getUser(decoded.name);
        if (user) {
            //  authorised
            req.body.user = user;
            next();
        } else {
            return res.status(500).json({err: "User not found" });
        }
    } else {
        return res.status(500).json({err: "unauthorised"});
    }
}