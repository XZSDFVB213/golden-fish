import { ICategory } from "../category/category.interface";
import { IReview } from "../review/review.interface";
import { IStore } from "../store/store.interface";

export interface IProduct {
  id: string;
  title: string;
  description: string;
  price: number;

  storeId: string;
  categoryId: string;

  category: ICategory;
  reviews: IReview[];
  images: string[];
}

export interface IProductInput extends Omit<IProduct, 'id'|'reviews'|'category'|'store'>{
    categoryId: string;
}