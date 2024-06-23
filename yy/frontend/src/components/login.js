import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
//import Link from '@mui/material/Link';
import { Link } from "react-router-dom";
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import axios from '../api';
function Copyright(props) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {'Copyright © '}
      <Link color="inherit" href="https://mui.com/">
        Your Website
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

export default function Login(props) {
  const { token, setToken } = props;
  const [UserName, setUserName] = React.useState('');
  const [Password, setPassword] = React.useState('');
  const handleHookChange = (func) => (event) => {
    func(event.target.value);
  };
  const sendLogin = async (params) => {
    console.log(UserName)
    // TODO: 將密碼加密
    const {
      data: { message, Login },
    } = await axios.post('/api/login-request', {
      params
    });
    alert(message);
    if (Login === true) {
      setToken(UserName);
    }
  }
  const handleLogin = (event) => {
    event.preventDefault();
    const params = {
      UserName: UserName,
      Password: Password,
    };
    console.log('send')
    sendLogin(params);
  };
  const theme = createTheme();
  if (token) {
    return (
      <Typography variant="h6" component="div" sx={{ flexGrow: 1, m: 8, p: 2 }}>
        已成功登入，請轉跳
        <Link to={"/message"} sx={{ m: 8, p: 2 }}>訊息管理介面</Link>
      </Typography>
    )
  }
  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          <Box component="form" onSubmit={handleLogin} noValidate sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="UserName"
              label="UserName"
              name="UserName"
              value={UserName}
              onChange={handleHookChange(setUserName)}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              value={Password}
              onChange={handleHookChange(setPassword)}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}

            >
              Sign In
            </Button>
            <Grid container>
              <Grid item xs>
                <Typography variant="h8">
                  僅提供管理員使用
                </Typography>
              </Grid>
            </Grid>
          </Box>
        </Box>
        <Copyright sx={{ mt: 8, mb: 4 }} />
      </Container>
    </ThemeProvider>
  )

}