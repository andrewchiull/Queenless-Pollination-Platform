"use client";

import { Button, Card, CardContent, Container, Grid, Typography } from '@mui/material';
import Gallery from './components/gallery';
import { styled } from "@mui/material/styles";
const CardContentCustomPadding = styled(CardContent)(`
  padding: 0px;
  &:last-child {
    padding-bottom: 0px;
  }
`);

const Home = () => {

  return (
    <Container style={{ margin: '2rem 0' }}>
      <Grid container spacing={1}>
        <Grid item sx={{ width: '100%' }}>
          <Card>
            <CardContentCustomPadding>
              <Gallery />
            </CardContentCustomPadding>
          </Card >
        </Grid>

        <Grid item sx={{ width: '100%' }}>
          <Card>
            <CardContentCustomPadding>
              <Typography variant="h4"
                sx={{
                  height: '10vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: 'white', backgroundColor: 'black'
                }}
              >
                無蜂王授粉技術
              </Typography>
            </CardContentCustomPadding>
          </Card >
        </Grid>

        <Grid item sx={{ width: '100%' }}>
          <Card>
            <CardContentCustomPadding>
              <Button
                sx={{ width: '100%' }}
                variant="contained" color="warning" onClick={() => window.location.href = '/order'}>
                立即下單
              </Button>
            </CardContentCustomPadding>
          </Card >
        </Grid>
      </Grid>



    </Container>
  );
};

export default Home;