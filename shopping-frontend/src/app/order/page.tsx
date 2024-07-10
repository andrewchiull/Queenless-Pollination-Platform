"use client";

import { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Grid, CircularProgress } from '@mui/material';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/ReactToastify.min.css';
import ProductCard from './components/ProductCard';
import OrderForm from './components/OrderForm';

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
}

const Buy = () => {

  const [products, setProducts] = useState<Product[]>([]);
  const [quantities, setQuantities] = useState<{ [key: number]: number }>({});

  const [loading, setLoading] = useState<boolean>(true); // Add loading state

  useEffect(() => {
    axios.get('/api/products').then(response => {
      setProducts(response.data);
      setLoading(false); // Set loading to false after data is fetched
    }).catch(error => {
      console.error("There was an error fetching the products!", error);
      setLoading(false); // Set loading to false in case of error
    });
  }, []);

  const handleQuantityChange = (productId: number, quantity: number) => {
    setQuantities(prevQuantities => ({
      ...prevQuantities,
      [productId]: quantity
    }));
  };

  return (
    <Container style={{ margin: '2rem 0' }}>
      <Grid container spacing={4}>
        {loading ? (
          <Grid item xs={12}>
            <Grid container justifyContent="center">
              <CircularProgress />
            </Grid>
          </Grid>
        ) : (
          <>
            {
              products.map(product => (
                <Grid item key={product.id} xs={12} sm={6}>
                  <ProductCard
                    product={product}
                    quantity={quantities[product.id] || 0}
                    onQuantityChange={handleQuantityChange}
                  />
                </Grid>
              ))
            }
          </>
        )}

      </Grid>

      <OrderForm
        products={products}
        quantities={quantities}
        setQuantities={setQuantities}
      />
      <ToastContainer />
    </Container>
  );
};

export default Buy;