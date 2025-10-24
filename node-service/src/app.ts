import express, { Request, Response } from 'express';
import cors from 'cors';
import { config } from './config/index';
import connectMongo from './config/db';
import { privateRouter, publicRouter } from './v1/routes';
import logger from './config/logger';

const app = express();
const PORT = config.PORT;


app.use(cors());


app.use(express.json());

app.use(express.urlencoded({ extended: true }));

// request logger middleware
app.use((req: Request, res: Response, next) => {
  logger.debug(`${new Date().toISOString()} ${req.method} ${req.url}`);
  next();
});

app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'OK', uptime: process.uptime(), message: 'Inventory service is healthy' });
});

// Service routes
app.use('/api/v1', privateRouter);
app.use('/', publicRouter);

//404 handler
app.use((req: Request, res: Response) => {
  logger.warn(`404 - Not Found: ${req.method} ${req.url}`);
  res.status(404).json({ error: 'Not Found' });
})


// Error handling middleware
app.use((err: any, req: Request, res: Response, next: Function) => {
  logger.error(`Error processing request: ${err.message}`);
  res.status(500).json({ error: 'Internal Server Error' });
});




const startServer = async () => {
  try {
    // Start server
    await connectMongo()

    const server = app.listen(PORT, () => {
      logger.info(`🚀Inventory Server is running on http://localhost:${PORT}`);
    });
  } catch (error) {
    logger.error(`failed to start the server ${error}`);
    process.exit(1);
  }
}

startServer();


