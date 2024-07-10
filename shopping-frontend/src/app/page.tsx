"use client";

import { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Grid, Card, CardContent, Typography, Button, TextField } from '@mui/material';

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

  useEffect(() => {
    axios.get('/api/products').then(response => {
      setProducts(response.data);
    }).catch(error => {
      console.error("There was an error fetching the products!", error);
    });
  }, []);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    // Handle form submission logic here
    console.log({ name, email, address });
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
                <Button variant="contained" color="primary">購買</Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
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
  );
};

export default Home;