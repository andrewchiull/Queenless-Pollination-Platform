"use client";

import { Button, Card, CardContent, Container, Grid, Typography } from '@mui/material';
import Gallery from './components/gallery';
import { styled } from "@mui/material/styles";
import * as React from "react";

const CardContentCustomPadding = styled(CardContent)(`
  padding: 0px;
  &:last-child {
    padding-bottom: 0px;
  }
`);

// [javascript - React 18 TypeScript children FC - Stack Overflow](https://stackoverflow.com/questions/71788254/react-18-typescript-children-fc/71809927#71809927)
type Props = {
  children?: React.ReactNode
};
const CardInGrid: React.FC<Props> = ({ children }) => (
  <Grid item sx={{ width: '100%' }}>
    <Card>
      <CardContentCustomPadding>
        {children}
      </CardContentCustomPadding>
    </Card >
  </Grid>
);

const Home = () => {

  return (
    <Container style={{ margin: '2rem 0' }}>
      <Grid container spacing={1}>

        <CardInGrid>
          <Gallery />
        </CardInGrid>

        <CardInGrid>
          <Typography variant="h5"
            sx={{
              height: '10vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'white', backgroundColor: 'black'
            }}
          >
            無蜂王授粉媒合平台
          </Typography>
        </CardInGrid>

        <CardInGrid>
          <Button
            sx={{ width: '100%' }}
            variant="contained" color="warning" onClick={() => window.location.href = '/order'}>
            立即下單
          </Button>
        </CardInGrid>

      </Grid>
    </Container >
  );
};

export default Home;