"use client";

import { useState } from 'react';
import axios from 'axios';
import { Container, TextField, Button, Typography } from '@mui/material';

const Buy = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    await axios.post('/api/buyers', { name, email, address });
    alert('購買成功');
  };

  return (
    <Container>
      <form onSubmit={handleSubmit}>
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

export default Buy;
