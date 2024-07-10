"use client";

import { Button } from '@mui/material';


const Home = () => {

  return (
    <Button variant="contained" color="primary" onClick={() => window.location.href='/order'}>
      立即下單
    </Button>
  );
};

export default Home;