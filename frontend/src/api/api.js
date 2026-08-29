import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

export const get = async (url, config = {}) => {
  const res = await api.get(url, config);
  return res.data;
};

export const post = async (url, data = {}, config = {}) => {
  const res = await api.post(url, data, config);
  return res.data;
};

export const put = async (url, data = {}, config = {}) => {
  const res = await api.put(url, data, config);
  return res.data;
};

export const patch = async (url, data = {}, config = {}) => {
  const res = await api.patch(url, data, config);
  return res.data;
};

export const del = async (url, config = {}) => {
  const res = await api.delete(url, config);
  return res.data;
};