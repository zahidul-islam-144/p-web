import cors from 'cors';
import express, { Application, NextFunction, Request, Response } from 'express';
import helmet from 'helmet';
import globalErrorHandler from './app/middlewares/errorHandlerMiddlware';
import customResponse from './app/utils/customResponse';
import router from './app/routes';
import { EHttpStatusCode } from './app/interface/interface';
import cookieParser from 'cookie-parser';

const app: Application = express();

//added middlewares
app.use(express.json());
app.use(cookieParser());
app.use(
  cors<Request>({ origin: ['http://localhost:3000'], credentials: true }),
);
app.use(express.urlencoded({ extended: false }));
app.use(helmet());

// app.use((req:Request, res:Response, next:NextFunction) => {
//   // Allow cross-origin resource sharing
//   res.header('Access-Control-Allow-Origin', req.headers.origin);
//   res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');

//   // Expose custom headers that you want to be accessible in the frontend
//   res.header('Access-Control-Expose-Headers', 'accessToken');

//   // Handle preflight requests
//   if (req.method === 'POST') {
//     res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
//     return res.status(200).json({});
//   }

//   next();
// });

// registered all application routes
app.use('/api', router);

// base route for ensuring sever connection
app.get('/', (req: Request, res: Response) => {
  customResponse(res, {
    statusCode: EHttpStatusCode.OK,
    success: true,
    message: 'Welcome to the server. Port:8080',
    data: null,
  });
});

// handled invalid routes
app.all('*', (req: Request, res: Response) => {
  customResponse(res, {
    statusCode: EHttpStatusCode.BAD_REQUEST,
    success: false,
    message: 'Invalid Path.',
    data: null,
  });
});

//global error middleware
app.use(globalErrorHandler);

export default app;

/*

// app.use(helmet({
//   contentSecurityPolicy: false,  // Disable contentSecurityPolicy if it's affecting headers
// }));
// exposedHeaders: ['accessToken', 'Accesstoken']



*/
