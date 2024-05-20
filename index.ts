import { Hono } from 'hono';
// import { logger as honoLogger } from 'hono/logger';
import { createLogger, transports, format } from 'winston';
import LokiTransport from 'winston-loki';
import { pino } from 'pino';

const lg = pino({ level: 'debug' });

const logger = createLogger({
  transports: [
    new LokiTransport({
      host: 'http://127.0.0.1:3100',
      labels: { app: 'api-obs' },
      json: true,
      batching: false,
      format: format.json(),
      replaceTimestamp: true,
      onConnectionError: (err) => console.error(err),
    }),
    new transports.Console({
      format: format.combine(format.simple(), format.colorize()),
    }),
  ],
});

// const customLogger = (message: string, ...args: string[]) => {
//   console.log(message, ...args);
// };

const app = new Hono();
// app.use(honoLogger(customLogger));

app.get('/health', async (c) => {
  logger.info({ message: 'Health check' });
  lg.info('Health check');
  return c.json({ success: true, message: 'Up and running!' });
});

export default app;
