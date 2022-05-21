import express, { Express } from 'express';
import dotenv from 'dotenv';
import path from "path";
import morgan from 'morgan';
import sassMiddleware from 'node-sass-middleware';
import bcrypt from "bcrypt";
import {genericErrorHandler, notFoundError} from "./src/middlewares/errorHandler";
import router from "./src/routes/routes";
import {headersOptions} from "./src/middlewares/cors";
import {connectToDB} from "./src/service/database";

dotenv.config();

const app: Express = express();
const port = process.env.PORT;

app.use(morgan('dev')); //  logging
app.use(
    sassMiddleware({
        src: path.join(__dirname, 'public'),
        dest: path.join(__dirname, 'public'),
        indentedSyntax: false, // true = .sass and false = .scss
        sourceMap: true,
    }),
);
app.use(express.static(path.join(__dirname, './public')));
app.use(express.json()); //  expects request data to be sent in JSON format, which often resembles a simple JS object
app.use(express.urlencoded({ extended: true })); //  expects request data to be sent encoded in the URL, usually in strings or arrays
app.use(headersOptions);

// view engine setup
app.set('views', path.join(__dirname, '/views'));
app.set('view engine', 'hbs');

app.use('/', router);

// Error Middleware
app.use(genericErrorHandler);
app.use(notFoundError);

connectToDB();

app.listen(port, () => {
    console.log(`⚡️[server]: Running at http://localhost:${port}`);
});