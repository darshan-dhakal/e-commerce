import api from "./axios";
import {
  User,
  LoginPayload,
  RegisterPayload,
  UpdateUserPayload,
} from "../types/user.types";

export const authAPI = {
  register: async (payload: RegisterPayload): Promise<User> => {
    const res = await api.post("/users", payload);
    return res.data;
  },

  login: async (payload: LoginPayload): Promise<User> => {
    const res = await api.post("/users/login", payload);
    return res.data;
  },

  getProfile: async (): Promise<User> => {
    const res = await api.get("/users/profile");
    return res.data;
  },

  updateProfile: async (payload: UpdateUserPayload): Promise<User> => {
    const res = await api.put("/users/profile", payload);
    return res.data;
  },
};
