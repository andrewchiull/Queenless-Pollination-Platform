import { Router } from 'express';
import { promises as fs } from 'fs';
import path from 'path';
import pool from './db';
import { RowDataPacket, ResultSetHeader } from 'mysql2';
import axios from 'axios';

const router = Router();

// Function to read local JSON file
async function readLocalProducts(): Promise<any[]> {
  const filePath = path.join(__dirname, '../data/products.json');
  const data = await fs.readFile(filePath, 'utf8');
  return JSON.parse(data);
}

// If the database is not ready, read the local products file
router.get('/product', async (req, res) => {
  try {
    const [rows] = await pool.query<RowDataPacket[]>('SELECT id, name, price, description, created_at FROM product');
    res.json(rows);
  } catch (error) {
    console.error('Error fetching products from database. Please check the database connection.\n', error);
    try {
      console.log('Reading local products file instead...');
      const localProducts = await readLocalProducts();
      res.json(localProducts);
    } catch (localError) {
      console.error('Error reading local products file.\n', localError);
      res.status(500).json({ message: 'Error fetching products' });
    }
  }
});

router.post('/order', async (req, res) => {
  const { name, email, address, order_items } = req.body;
  try {
    // Insert order information
    for (const item of order_items) {
      await pool.query<ResultSetHeader>(
        'INSERT INTO `order` (name, email, address, product_id, quantity) VALUES (?, ?, ?, ?, ?)', 
        [name, email, address, item.product_id, item.quantity]
      );
    }

    res.status(200).json({ message: '訂單已成功提交！' });
    
  } catch (error) {
    console.error('Error submitting order. Please check the database connection.\n', error);
    res.status(500).json({ message: 'Error submitting order' });
  }
});

router.get('/mapbox-proxy/:url', (req, res) => {
  const url = req.params.url;
  axios.get(url).then((response: { data: any; }) => {
    res.send(response.data);
  }).catch((error: any) => {
    console.error('Error fetching mapbox data. Please check the connection.\n', error);
    res.status(500).json({ message: 'Error fetching mapbox data' });
  });
});

export default router;
