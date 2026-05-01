import axios from "axios";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
export const API = `${BACKEND_URL}/api`;

export const api = axios.create({
  baseURL: API,
  headers: { "Content-Type": "application/json" },
});

export const fetchProducts = async (params = {}) => {
  const { data } = await api.get("/products", { params });
  return data;
};

export const fetchProduct = async (id) => {
  const { data } = await api.get(`/products/${id}`);
  return data;
};

export const createProduct = async (payload) => {
  const { data } = await api.post("/products", payload);
  return data;
};

export const updateProduct = async (id, payload) => {
  const { data } = await api.put(`/products/${id}`, payload);
  return data;
};

export const deleteProduct = async (id) => {
  const { data } = await api.delete(`/products/${id}`);
  return data;
};

export const fetchCategories = async () => {
  const { data } = await api.get("/categories");
  return data;
};

export const createOrder = async (payload) => {
  const { data } = await api.post("/orders", payload);
  return data;
};

export const sendContact = async (payload) => {
  const { data } = await api.post("/contact", payload);
  return data;
};
