import dotenv from 'dotenv';

dotenv.config();

const envConfig = {
  port: process.env.PORT || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',
  mongodbUri: process.env.MONGODB_URI,
  jwtSecret: process.env.JWT_SECRET,
  jwtExpire: process.env.JWT_EXPIRE || '7d',
  ollamaBaseUrl: process.env.OLLAMA_BASE_URL,
  ollamaModel: process.env.OLLAMA_MODEL,
  ollamaApiKey: process.env.OLLAMA_API_KEY,
  adminSecret: process.env.ADMIN_SECRET,
};

export default envConfig;
