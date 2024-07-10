"use client";

import { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Grid, Card, CardContent, Typography, Button, TextField, InputLabel, MenuItem, FormControl, Select, ThemeProvider, createTheme } from '@mui/material';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
}


const theme = createTheme({
  palette: {
    mode: 'light',
  },
});

const Home = () => {
  useEffect(() => {
    if (typeof document !== 'undefined') {
      const metaTag = document.createElement('meta');
      metaTag.name = 'color-scheme';
      metaTag.content = 'light dark';
      document.head.appendChild(metaTag);
    }
  }, []);

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
    const orderDetails = products
      .filter(product => quantities[product.id] > 0)
      .map(product => `${product.name} x${quantities[product.id]}`)
      .join(', ');

    console.log({ name, email, address, order });
    axios.post('/api/orders', { name, email, address, order })
      .then(response => {
        console.log(response);

        toast.success(`訂單已成功提交！姓名：${name}，電子郵件：${email}，地址：${address}，訂單內容：${orderDetails}`);
      })
      .catch(error => {
        toast.error("提交訂單時出錯，請稍後再試！");
        console.error("There was an error submitting the order!", error);
      });

    // Clear form fields
    setName('');
    setEmail('');
    setAddress('');
    setQuantities({});
  };

  return (
    <ThemeProvider theme={theme}>
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

        <Card style={{ margin: '2rem 0' }}>
          <CardContent>
            <form onSubmit={handleSubmit}>
              <Typography variant="h5">購買者資訊</Typography>
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
              <Button type="submit" variant="contained" color="primary"
                style={{ margin: '1rem 0 0 0', width: '100%' }}
              >
                提交
              </Button>
            </form>
          </CardContent>
        </Card>
        <ToastContainer />
      </Container>
    </ThemeProvider>
  );
};

export default Home;