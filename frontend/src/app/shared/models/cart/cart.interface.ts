import { IProduct } from '../product/product.interface';

export interface ICartItem {
  id: number;
  product: IProduct;
  quantity: number;
  storeId: string; // or any other appropriate type for the store ID
  price: number;
}
