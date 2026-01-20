import api from "./axios";
import {
  Order,
  CreateOrderPayload,
  PaymentPayload,
} from "../types/order.types";

export const orderAPI = {
  createOrder: async (payload: CreateOrderPayload): Promise<Order> => {
    const res = await api.post("/orders", payload);
    return res.data;
  },

  getUserOrders: async (): Promise<Order[]> => {
    const res = await api.get("/orders");
    return res.data;
  },

  getOrderById: async (id: string): Promise<Order> => {
    const res = await api.get(`/orders/${id}`);
    return res.data;
  },

  payOrder: async (id: string, payload: PaymentPayload): Promise<Order> => {
    const res = await api.put(`/orders/${id}/payment`, payload);
    return res.data;
  },
};
