import { webcrypto } from 'node:crypto';
if (!globalThis.crypto) globalThis.crypto = webcrypto;

import app from './src/app.js';
import connectDB from './src/config/database.js';
import envConfig from './src/config/envConfig.js';

// Connect to MongoDB
connectDB();

const server = app.listen(envConfig.port, () => {
  console.log(`Server running in ${envConfig.nodeEnv} mode on port ${envConfig.port}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.log(`Error: ${err.message}`);
  server.close(() => process.exit(1));
});
