import express from 'express';
import morgan from 'morgan';
import cors from 'cors';

import { authRouter } from './modules/user/routes/auth.routes';
import { userRouter } from './modules/user/routes/user.routes';
import { matchRouter } from './modules/matches/routes/match.routes';
import { HttpStatus } from './utils/status-codes';

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

app.get('/', (_req, res) => {
  res.json({ status: 'ProFootball Live Backend is running ✅' });
});

// API Routes
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/matches', matchRouter);

// Global error handler
// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  const status = err.status || HttpStatus.INTERNAL_SERVER_ERROR;
  const message = err.message || 'Internal Server Error';
  res.status(status).json({ success: false, message });
});

export default app;



