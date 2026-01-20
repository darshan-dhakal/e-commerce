import { Product } from "./product.types";

export interface OrderItem {
  name: string;
  qty: number;
  image: string;
  price: number;
  product: string; // Product ID
}

export interface ShippingAddress {
  address: string;
  city: string;
  postalCode: string;
  country: string;
}

export interface PaymentResult {
  id: string;
  status: string;
  update_time: string;
  email_address: string;
}

export interface Order {
  _id: string;
  user: string;
  orderItems: OrderItem[];
  shippingAddress: ShippingAddress;
  paymentMethod: string;
  paymentResult?: PaymentResult;
  taxPrice: number;
  shippingPrice: number;
  totalPrice: number;
  isPaid: boolean;
  paidAt?: Date;
  isDelivered: boolean;
  deliveredAt?: Date;
  createdAt: string;
  updatedAt: string;
}

export interface CreateOrderPayload {
  orderItems: OrderItem[];
  shippingAddress: ShippingAddress;
  paymentMethod: string;
  shippingPrice: number;
  taxPrice: number;
  totalPrice: number;
}

export interface PaymentPayload {
  id: string;
  status: string;
  create_time: string;
  email_address: string;
}
