import { ICartItem } from "../cart/cart.interface";
import { IUser } from "../user/user.interface";

interface Amount{
    value: string;
    currency: string;
}
interface IRecipient{
    account_id: string;
    gateway_id: string;
}
interface IPaymentMethod{
    type:string;
    id:string;
    saved:boolean;
}
interface IConfirmation{
    type:string;
    return_url:string;
    confirmation_url:string;
}
export interface IPaymentResponse{
    id: string;
    status: string;
    amount: Amount;
    recipient: IRecipient;
    payment_method: IPaymentMethod;
    confirmation: IConfirmation;
    created_at: Date;
}
export enum EnumOrderStatus {
  PENDING = 'PENDING',
  PAYED = 'PAYED',
  PROCESSING = 'PROCESSING',
  DELIVERY = 'DELIVERY',
  READY = 'READY',
  COMPLETED = 'COMPLETED',
  CANCELED = 'CANCELED',
}
export interface IOrder{
    id:string;
    createdAt:string;
    items:ICartItem[]
    status:EnumOrderStatus;
    total:number;
    user:IUser;
}