"use client";

import { Button } from '@mui/material';


const Home = () => {

  return (
    <Button variant="contained" color="primary" onClick={() => window.location.href='/buy'}>
      Link to Buy
    </Button>
  );
};

export default Home;