import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';

dotenv.config();

const app: Application = express();

// ── Security & Utility Middleware ──────────────────────────────
app.use(helmet());
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ── Routes ────────────────────────────────────────────────────
app.get('/health', (req: Request, res: Response) => {
  console.log('Health check endpoint hit');  
  res.status(200).json({
    status: 'success',
    message: 'EnterpriseIQ API is running',
    environment: process.env.NODE_ENV,
    timestamp: new Date().toISOString(),
  });
});

app.use((req: Request, res: Response) => {
  res.status(404).json({
    status: 'error',
    message: `Route ${req.method} ${req.originalUrl} not found`,
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} in ${process.env.NODE_ENV} mode`);
});

export default app;