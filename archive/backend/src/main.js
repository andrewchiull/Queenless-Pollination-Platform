import express from 'express';
import cors from 'cors';
import path from 'path';
import { createRequire } from 'module';
import { fileURLToPath } from 'url';
import routes from './routes/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const require = createRequire(import.meta.url);

require('dotenv').config();

const app = express();
const port = process.env.PORT || 4000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/', routes);
app.use('/', express.static(path.join(__dirname, '../public')));

// MySQL Code goes here

// Start server
app.listen(port, () => console.log(`Listening on port ${port}`));
