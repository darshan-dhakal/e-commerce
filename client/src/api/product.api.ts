import api from "./axios";
import { Product } from "../types/product.types";

export const productAPI = {
  getAllProducts: async (): Promise<Product[]> => {
    const res = await api.get("/products");
    return res.data;
  },

  getProductById: async (id: string): Promise<Product> => {
    const res = await api.get(`/products/${id}`);
    return res.data;
  },
};
