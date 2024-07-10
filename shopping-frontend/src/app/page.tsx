"use client";

import { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Grid, Card, CardContent, Typography, Button, TextField, InputLabel, MenuItem, FormControl, Select } from '@mui/material';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
}

const Home = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [quantities, setQuantities] = useState<{ [key: number]: number }>({});

  useEffect(() => {
    axios.get('/api/products').then(response => {
      setProducts(response.data);
    }).catch(error => {
      console.error("There was an error fetching the products!", error);
    });
  }, []);

  const handleQuantityChange = (productId: number, quantity: number) => {
    setQuantities(prevQuantities => ({
      ...prevQuantities,
      [productId]: quantity
    }));
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const order = products.map(product => ({
      productId: product.id,
      quantity: quantities[product.id] || 0
    }));
    // Handle form submission logic here
    const orderDetails = products
      .filter(product => quantities[product.id] > 0)
      .map(product => `${product.name} x${quantities[product.id]}`)
      .join(', ');
    toast.success(`訂單已成功提交！姓名：${name}，電子郵件：${email}，地址：${address}，訂單內容：${orderDetails}`);
    console.log({ name, email, address, order });
  };

return (
  <Container>
    <Grid container spacing={4}>
      {products.map(product => (
        <Grid item key={product.id} xs={12} sm={6}>
          <Card>
            <CardContent>
              <Typography variant="h5">{product.name}</Typography>
              <Typography>{product.description}</Typography>
              <Typography variant="h6">${product.price}</Typography>
              <FormControl fullWidth margin="normal" variant="outlined">
                <InputLabel>數量</InputLabel>
                <Select
                  value={quantities[product.id] || 0}
                  onChange={(e) => handleQuantityChange(product.id, parseInt(e.target.value as string, 10))}
                  label="數量"
                >
                  {Array.from({ length: 11 }, (_, n) => (
                    <MenuItem key={n} value={n}>{n}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
    <Container>
      <form onSubmit={handleSubmit} style={{ marginTop: '2rem' }}>
        <Typography variant="h4">購買者資訊</Typography>
        <TextField
          label="姓名"
          value={name}
          onChange={(e) => setName(e.target.value)}
          fullWidth
          margin="normal"
        />
        <TextField
          label="電子郵件"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          fullWidth
          margin="normal"
        />
        <TextField
          label="地址"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          fullWidth
          margin="normal"
        />
        <Button type="submit" variant="contained" color="primary">提交</Button>
      </form>
    </Container>
    <ToastContainer />
  </Container>
);
};

export default Home;