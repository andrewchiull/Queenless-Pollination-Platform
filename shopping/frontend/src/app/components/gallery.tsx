import * as React from 'react';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';

function srcset(image: string, size: number, rows = 1, cols = 1) {
  return {
    src: `${image}?w=${size * cols}&h=${size * rows}&fit=crop&auto=format`,
    srcSet: `${image}?w=${size * cols}&h=${size * rows
      }&fit=crop&auto=format&dpr=2 2x`,
  };
}

export default function Gallery() {
  return (
    <ImageList
      sx={{ margin: '0'}}
      variant="quilted"
      cols={4}
    >
      {itemData.map((item) => (
        <ImageListItem key={item.img} cols={item.cols || 1} rows={item.rows || 1}>
          <img
            {...srcset(item.img, 121, item.rows, item.cols)}
            loading="lazy"
          />
        </ImageListItem>
      ))}
    </ImageList>
  );
}

const itemData = [
  {
    img: 'https://images.agriharvest.tw/wp-content/uploads/2023/03/S__8986748-1024x768.jpg',
    rows: 2,
    cols: 2,
  },
  {
    img: 'https://www.ntu.edu.tw/spotlight/2023/2145_20230329_4.jpg',
  },
  {
    img: 'https://www.ntu.edu.tw/spotlight/2023/2145_20230329_3.jpg',
  },
  {
    img: 'https://www.ntu.edu.tw/spotlight/2023/2145_20230329_2.jpg',
    cols: 2,
  }
];