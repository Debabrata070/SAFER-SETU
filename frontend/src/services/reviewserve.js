import axios from "axios";
import { API_BASE_URL } from "../config/apiBase.js";

export const addReview = (data) =>
  axios.post(`${API_BASE_URL}/api/reviews`, data);

export const getReviews = (hotelId) =>
  axios.get(`${API_BASE_URL}/api/reviews/${hotelId}`);