import { IOrder } from "../order/order.interface";
import { IProduct } from "../product/product.interface";
import { IStore } from "../store/store.interface";

export interface IUser {
    id:string;
    name: string;
    email: string;
    picture:string;
    favorites: IProduct[];
    stores: IStore[];
    orders: IOrder[];
}