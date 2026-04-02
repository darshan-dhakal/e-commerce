import api from "./axios";
import { Product } from "../types/product.types";
import { User } from "../types/user.types";
import { Order } from "../types/order.types";

export const adminAPI = {
  // User Management
  listUsers: async (): Promise<User[]> => {
    const res = await api.get("/users");
    return res.data;
  },

  getUserDetail: async (id: string): Promise<User> => {
    const res = await api.get(`/users/${id}`);
    return res.data;
  },

  // Product Management
  createProduct: async (product: any): Promise<Product> => {
    const res = await api.post("/products", product);
    return res.data;
  },

  updateProduct: async (id: string, product: any): Promise<Product> => {
    const res = await api.put(`/products/${id}`, product);
    return res.data;
  },

  deleteProduct: async (id: string): Promise<void> => {
    await api.delete(`/products/${id}`);
  },

  // Order Management
  listAllOrders: async (): Promise<Order[]> => {
    const res = await api.get("/orders/admin/all");
    return res.data;
  },

  updateOrderStatus: async (id: string, status: string): Promise<Order> => {
    const res = await api.put(`/orders/${id}/status`, { status });
    return res.data;
  },

  addOrderNote: async (id: string, note: string): Promise<Order> => {
    const res = await api.post(`/orders/${id}/notes`, { note });
    return res.data;
  },

  requestRefund: async (id: string, reason: string): Promise<Order> => {
    const res = await api.post(`/orders/${id}/refund/request`, { reason });
    return res.data;
  },

  approveRefund: async (id: string): Promise<Order> => {
    const res = await api.put(`/orders/${id}/refund/approve`, {});
    return res.data;
  },

  completeRefund: async (id: string): Promise<Order> => {
    const res = await api.put(`/orders/${id}/refund/complete`, {});
    return res.data;
  },

  rejectRefund: async (id: string, reason?: string): Promise<Order> => {
    const res = await api.put(`/orders/${id}/refund/reject`, { reason });
    return res.data;
  },
};
