import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, Typography, Container, Box } from '@mui/material';
import axios from '../api';

export default function Register() {
  const [UserName, setUserName] = React.useState('');
  const [Password, setPassword] = React.useState('');
  const navigate = useNavigate();

  const handleHookChange = (func) => (event) => {
    func(event.target.value);
  };

  const handleRegister = async (event) => {
    event.preventDefault();
    const params = { UserName, Password };
    const { data: { message, Register } } = await axios.post('/api/register', { params });
    alert(message);
    if (Register) {
      navigate('/login');
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box sx={{ marginTop: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography component="h1" variant="h5">Register</Typography>
        <Box component="form" onSubmit={handleRegister} noValidate sx={{ mt: 1 }}>
          <TextField margin="normal" required fullWidth id="UserName" label="UserName" name="UserName" value={UserName} onChange={handleHookChange(setUserName)} />
          <TextField margin="normal" required fullWidth name="password" label="Password" type="password" id="password" value={Password} onChange={handleHookChange(setPassword)} />
          <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>Register</Button>
        </Box>
      </Box>
    </Container>
  );
}
