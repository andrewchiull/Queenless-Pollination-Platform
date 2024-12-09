import { useState, useEffect } from 'react';
import { Card, CardContent, Typography, TextField, Button } from '@mui/material';
import axios from 'axios';
import { toast } from 'react-toastify';

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
}

interface PurchaseFormProps {
  products: Product[];
  quantities: { [key: number]: number };
  setQuantities: React.Dispatch<React.SetStateAction<{ [key: number]: number }>>;
}


const PurchaseForm = ({ products, quantities, setQuantities }: PurchaseFormProps) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [totalExpense, setTotalExpense] = useState(0);

  const calculateTotalExpense = () => {
    const total = products.reduce((sum, product) => {
      return sum + (product.price * (quantities[product.id] || 0));
    }, 0);
    setTotalExpense(total);
  };

  useEffect(() => {
    calculateTotalExpense();
  }, [quantities]);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const item = products.map(product => ({
      product_id: product.id,
      quantity: quantities[product.id] || 0
    }));

    const details = products
      .filter(product => quantities[product.id])
      .map(product => `${product.name} x${quantities[product.id]}`)
      .join(', ');

    function requestBody(): { description: string; customer: { name: string; email: string; address: string; }; item: { product_id: number; quantity: number; }[]; } | undefined {
      return {
        description: `姓名：${name}\n電子郵件：${email}\n地址：${address}\n訂單內容：${details}`,
        customer: {
          name, email, address
        },
        item: item
      };
    }
    axios.post('/api/purchase/', requestBody())
      .then(response => {
        console.log(response);
        toast.success(
          <div>
            訂單已成功提交！<br />
            姓名：{name}<br />
            電子郵件：{email}<br />
            地址：{address}<br />
            訂單內容：{details}
          </div>,
          {
          position: 'top-center',
          autoClose: false,
          closeOnClick: false,
          closeButton: ({ closeToast }) => (
            <Button onClick={closeToast}>
              回到首頁
            </Button>
          ),
          onClose: () => {
            window.location.href = '/';
          }
        });
      })
      .catch(error => {
        toast.error("提交訂單時出錯，請稍後再試！");
        console.error(error);
        console.log(requestBody());
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
          <Typography variant="h6" style={{ margin: '1rem 0' }}>
            總費用: ${totalExpense.toFixed(2)}
          </Typography>
          <Button type="submit" variant="contained" color="primary" style={{ margin: '1rem 0 0 0', width: '100%' }}>
            送出訂單
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default PurchaseForm;
