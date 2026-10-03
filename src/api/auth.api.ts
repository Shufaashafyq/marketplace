import api from "./axios";

export type RegisterData = {
  name: string;
  email: string;
  password: string;
};

export type LoginData = {
  email: string;
  password: string;
};

export type User = {
  id: string;
  name: string;
  email: string;
  role: "USER" | "ADMIN";
};

export async function registerUser(data: RegisterData) {
  const response = await api.post("/auth/register", data);

  return response.data;
}

export async function loginUser(data: LoginData) {
  const response = await api.post("/auth/login", data);

  return response.data;
}

export async function getCurrentUser() {
  const response = await api.get("/auth/me");

  return response.data.user as User;
}

export async function logoutUser() {
  const response = await api.post("/auth/logout");

  return response.data;
}

