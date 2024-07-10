import { Card, CardContent, Typography, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import Image from 'material-ui-image';
interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
}

interface ProductCardProps {
  product: Product;
  quantity: number;
  onQuantityChange: (productId: number, quantity: number) => void;
}

const ProductCard = ({ product, quantity, onQuantityChange }: ProductCardProps) => (
  <Card>
    <CardContent>
      <Image
        src={`/images/products/${product.id}.png`}
        alt={product.name}
      />
      {/* <img src={`../public/images/products/${product.id}.png`} alt={product.name} style={{ width: '100px', height: '100px' }} /> */}
      <Typography variant="h5" style={{ margin: '1rem 0' }}>{product.name}</Typography>
      <Typography>{product.description}</Typography>
      <Typography variant="h6">${product.price}</Typography>
      <FormControl fullWidth margin="normal" variant="outlined">
        <InputLabel>數量</InputLabel>
        <Select
          value={quantity}
          onChange={(e) => onQuantityChange(product.id, parseInt(e.target.value as string, 10))}
          label="數量"
        >
          {Array.from({ length: 11 }, (_, n) => (
            <MenuItem key={n} value={n}>{n}</MenuItem>
          ))}
        </Select>
      </FormControl>
    </CardContent>
  </Card>
);

export default ProductCard;