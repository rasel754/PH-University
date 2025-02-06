import express, { Application, NextFunction, Request, Response } from 'express';
import cors from 'cors';
import { StudentRoute } from './app/modules/student/student.route';
import { userRoutes } from './app/modules/user/user.route';
import globalErrorHandler from './app/middlwares/globalErrorHandlers';
import notFound from './app/middlwares/notFound';
import router from './app/routes';
import cookieParser from 'cookie-parser';


const app: Application = express();

//parsers
app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: ['http://localhost:5173'] }));

app.use('/api/v1', router);


const test =async (req: Request, res: Response) => {
  
  const a=10;
  res.send(a);
};
//application route ex:- /api/v1/students/pore je route a user hit korbe

app.get('/', test);

app.use(globalErrorHandler)

//not found route 
app.use(notFound)



app.get('/', test);

export default app;
console.log(process.cwd());
//C:\L2Project\firstProject
