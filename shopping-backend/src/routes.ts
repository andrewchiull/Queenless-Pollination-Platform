import { Router } from 'express';
import pool from './db';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

const router = Router();

router.get('/products', async (req, res) => {
  const [rows] = await pool.query<RowDataPacket[]>('SELECT * FROM products');
  res.json(rows);
});

router.post('/buyers', async (req, res) => {
  const { name, email, address } = req.body;
  const [result] = await pool.query<ResultSetHeader>('INSERT INTO buyers (name, email, address) VALUES (?, ?, ?)', [name, email, address]);
  res.json({ id: result.insertId });
});

export default router;
