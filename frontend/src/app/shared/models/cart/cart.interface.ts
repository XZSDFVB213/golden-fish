import { IProduct } from '../product/product.interface';

export interface ICartItem {
  id: number;
  product: IProduct;
  quantity: number;
  price: number;
}
