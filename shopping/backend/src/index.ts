import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import routes from './routes';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use('/api', routes);

const PORT = process.env.PORT || 5000;

// root: welcome message
app.get('/', (req, res) => {
  res.send('Welcome to the shopping-backend. To use shopping-frontend GUI, go to http://localhost:3000');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
