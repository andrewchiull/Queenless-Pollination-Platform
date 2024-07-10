"use client";

import { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Grid, ThemeProvider, createTheme } from '@mui/material';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ProductCard from './components/ProductCard';
import OrderForm from './components/OrderForm';

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

  return (
    <ThemeProvider theme={theme}>
      <Container>
        <Grid container spacing={4}>
          {products.map(product => (
            <Grid item key={product.id} xs={12} sm={6}>
              <ProductCard
                product={product}
                quantity={quantities[product.id]}
                onQuantityChange={handleQuantityChange}
              />
            </Grid>
          ))}
        </Grid>

        <OrderForm
          products={products}
          quantities={quantities}
          setQuantities={setQuantities}
        />
        <ToastContainer />
      </Container>
    </ThemeProvider>
  );
};

export default Home;