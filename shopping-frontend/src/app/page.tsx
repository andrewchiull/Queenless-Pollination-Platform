"use client";

import { Button } from '@mui/material';
import QuiltedImageList from './components/gallery';


const Home = () => {

  return (
    <>
      <QuiltedImageList />
      https://www.ntu.edu.tw/spotlight/2023/2145_20230329_1.jpg
      <Button variant="contained" color="warning" onClick={() => window.location.href = '/order'}>
        立即下單
      </Button>
    </>
  );
};

export default Home;