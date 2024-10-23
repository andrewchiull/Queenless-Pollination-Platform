"use client";

import { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Grid, CircularProgress } from '@mui/material';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/ReactToastify.min.css';
import ProductCard from './components/ProductCard';
import PurchaseForm from './components/PurchaseForm';

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
}

const PurchasePage: React.FC = () => {

  const [products, setProducts] = useState<Product[]>([]);
  const [quantities, setQuantities] = useState<{ [key: number]: number }>({});

  const [loading, setLoading] = useState<boolean>(true); // Add loading state

  useEffect(() => {
    axios.get('/api/product/').then(response => {
      if (response.data.length === 0) {
        // Add testing product if no products are found
        axios.get('/api/testing/add_testing_product/').then(response => {
          console.log("Testing product added!");
        }).catch(error => {
          console.error("There was an error adding the testing product!", error);
        });
      }
      setProducts(response.data);
      setLoading(false); // Set loading to false after data is fetched
    }).catch(error => {
      console.error("There was an error fetching the products!", error);
    });
  }, []);

  const handleQuantityChange = (product_id: number, quantity: number) => {
    setQuantities(prevQuantities => ({
      ...prevQuantities,
      [product_id]: quantity
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

      <PurchaseForm
        products={products}
        quantities={quantities}
        setQuantities={setQuantities}
      />
      <ToastContainer />
    </Container>
  );
};

export default PurchasePage;