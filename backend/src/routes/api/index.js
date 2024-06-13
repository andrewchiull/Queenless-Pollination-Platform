import { Router } from 'express';
import pollinationRouter from './pollination.js';
const router = Router();

router.use('/', pollinationRouter);


export default router;
