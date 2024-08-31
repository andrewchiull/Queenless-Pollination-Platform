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

router.post('/orders', async (req, res) => {
  const { name, email, address, order } = req.body;

  try {

    // Insert order information
    for (const item of order) {
      await pool.query<ResultSetHeader>(
        'INSERT INTO orders (name, email, address, product_id, quantity) VALUES (?, ?, ?, ?, ?)', 
        [name, email, address, item.productId, item.quantity]
      );
    }

    res.json({ message: `訂單已成功提交！姓名：${name}，電子郵件：${email}，地址：${address}，訂單內容：${order}` });
    
  } catch (error) {
    console.error('Error submitting order:', error);
    res.status(500).json({ message: 'Error submitting order' });
  }
});

export default router;
