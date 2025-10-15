import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import giveawayRoutes from './routes/giveawayRoutes.js';
import giveawayModel from './models/giveawayModel.js';
import job from './lib/cron.js';
dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

console.log("Loaded PORT from .env:", process.env.PORT);

// Middleware
app.use(cors());
app.use(express.json());
job.start();

// Initialize database
await giveawayModel.initDB();

// Routes
app.use('/api', giveawayRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});