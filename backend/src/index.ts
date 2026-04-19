import express from 'express';
import cors from 'cors';
import { config } from './config.js';
import authRoutes from './routes/auth.js';
import userRoutes from './routes/users.js';
import accountRoutes from './routes/accounts.js';
import eventRoutes from './routes/events.js';
import partyRoutes from './routes/parties.js';
import communityRoutes from './routes/community.js';
import valetRoutes from './routes/valet.js';
import proRoutes from './routes/pro.js';

const app = express();

app.use(cors());
app.use(express.json());

app.get('/health', (_req, res) => res.json({ ok: true, service: 'layla-backend' }));

app.use('/auth', authRoutes);
app.use('/users', userRoutes);
app.use('/accounts', accountRoutes);
app.use('/events', eventRoutes);
app.use('/parties', partyRoutes);
app.use('/community', communityRoutes);
app.use('/valet', valetRoutes);
app.use('/pro', proRoutes);

app.use((err: unknown, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
});

// Safety net: Express 4 doesn't forward async throws. If a handler forgets to
// catch a DB/network error, this keeps the dev backend alive so the iPhone
// can retry instead of needing a manual restart.
process.on('unhandledRejection', (reason) => {
  console.error('[layla-backend] unhandledRejection:', reason);
});

app.listen(config.port, () => {
  console.log(`[layla-backend] listening on :${config.port} (${config.nodeEnv})`);
});
