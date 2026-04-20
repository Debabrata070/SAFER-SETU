import axios from "axios";
import { API_BASE_URL } from "../config/apiBase.js";

const API = `${API_BASE_URL}/api/hotels`;

export const searchHotels = async (filters) => {
  const res = await axios.get(`${API}/search`, {
    params: filters,
  });
  return res.data;
};
export const getHotelById = async (id) => {
  const res = await axios.get(`${API}/${id}`);
  return res.data;
};
export const getHotels = async () => {
  const res = await axios.get(API);
  return res.data;
};

export const getHotelsByDistrict = async (district) => {
  const res = await axios.get(`${API}?district=${district}`);
  return res.data;
};