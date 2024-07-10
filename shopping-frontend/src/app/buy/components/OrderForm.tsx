import { useState } from 'react';
import { Card, CardContent, Typography, TextField, Button } from '@mui/material';
import axios from 'axios';
import { toast } from 'react-toastify';

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
}

interface OrderFormProps {
  products: Product[];
  quantities: { [key: number]: number };
  setQuantities: React.Dispatch<React.SetStateAction<{ [key: number]: number }>>;
}


const OrderForm = ({ products, quantities, setQuantities }: OrderFormProps) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const order = products.map(product => ({
      productId: product.id,
      quantity: quantities[product.id] || 0
    }));
    const orderDetails = products
      .filter(product => quantities[product.id])
      .map(product => `${product.name} x${quantities[product.id]}`)
      .join(', ');

    axios.post('/api/orders', { name, email, address, order })
      .then(response => {
        toast.success(`訂單已成功提交！姓名：${name}，電子郵件：${email}，地址：${address}，訂單內容：${orderDetails}`, {
          position: 'top-center',
          autoClose: false,
          closeOnClick: false,
          closeButton: ({ closeToast }) => (
            <Button onClick={closeToast}>
              確認
            </Button>
          )
        });
      })
      .catch(error => {
        toast.error("提交訂單時出錯，請稍後再試！");
      });

    // Clear form fields
    setName('');
    setEmail('');
    setAddress('');
    setQuantities({});
  };

  return (
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
            required
          />
          <TextField
            label="電子郵件"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            fullWidth
            margin="normal"
            required
          />
          <TextField
            label="地址"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            fullWidth
            margin="normal"
            required
          />
          <Button type="submit" variant="contained" color="primary" style={{ margin: '1rem 0 0 0', width: '100%' }}>
            提交
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default OrderForm;