"use client";

import { useState, useEffect } from 'react';
import axios from 'axios';

import { Button } from '@mui/material';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const Home = () => {

  return (
    <Button variant="contained" color="primary" onClick={() => window.location.href='/buy'}>
      Link to Buy
    </Button>


  );
};

export default Home;