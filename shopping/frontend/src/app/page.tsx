"use client";

import { Button, Card, CardContent, Container, Grid, Typography } from '@mui/material';
import Gallery from './components/gallery';
import * as React from "react";


// [javascript - React 18 TypeScript children FC - Stack Overflow](https://stackoverflow.com/questions/71788254/react-18-typescript-children-fc/71809927#71809927)
type Props = {
  children?: React.ReactNode
  padding?: string
};

const CardInGridWrapper: React.FC<Props> = ({ children, padding }) => (
  <Grid item sx={{ width: '100%' }}>
    <Card>
      <CardContent sx={{
        padding: padding || 0,
        '&:last-child': {
          paddingBottom: padding || 0,
        },
      }}>
        {children}
      </CardContent>
    </Card >
  </Grid>
);

const Home = () => {

  return (
    <Container style={{ margin: '2rem 0' }}>
      <Grid container spacing={1}>

        <CardInGridWrapper>
          <Gallery />
        </CardInGridWrapper>

        <CardInGridWrapper>
          <Typography variant="h5"
            sx={{
              height: '10vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'white', backgroundColor: 'black'
            }}
          >
            無蜂王授粉媒合平台
          </Typography>
        </CardInGridWrapper>

        <CardInGridWrapper>
          <Button
            sx={{ width: '100%', fontSize: '1.5rem'}}
            variant="contained" color="warning" onClick={() => window.location.href = '/order'}>
            立即下單
          </Button>
        </CardInGridWrapper>

        <CardInGridWrapper padding="1rem">
          <Typography variant="body1" gutterBottom
            sx={{ color: 'text.secondary' }}>
            無蜂王蜂箱以蜂王費洛蒙取代蜂巢內的蜂王，可解決瓜果農長期找不到蜜蜂授粉的困境。
          </Typography>

          <Typography variant="body1"
            sx={{ color: 'text.disabled' }}>
            臺灣大學昆蟲系教授楊恩誠研究團隊，完成智慧農業創新，利用費洛蒙讓蜂箱內僅需存有一片巢脾，以取代蜂巢內的蜂王，並將此無蜂王蜂箱應用於溫室內進行授粉的任務。
          </Typography>
        </CardInGridWrapper>


        <CardInGridWrapper>
          <Button
            sx={{ width: '100%', fontSize: '1.5rem'}}
            variant="contained" color="info" onClick={() => window.location.href = '/map'}>
            map
          </Button>
        </CardInGridWrapper>

      </Grid>
    </Container >
  );
};

export default Home;