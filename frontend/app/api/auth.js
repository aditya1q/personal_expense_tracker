import axios from "axios";
import ls from 'localstorage-slim'

const api_url = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export const fetchRegisterUser = (userData) => {
  return axios.post(`${api_url}/v1/register`, userData)
    .then(res => res.data)
    .catch(error => { throw error.response?.data || error; });
};

export const fetchLoginUser = (credentials) => {
  return axios.post(`${api_url}/v1/login`, credentials)
    .then(res => res.data)
    .catch(error => { throw error.response?.data || error; });
};

export const fetchRefreshToken = (refreshToken) => {
  return axios.post(`${api_url}/v1/refresh`, { refresh_token: refreshToken })
    .then(res => {
      ls.set("access_token", res.data.access_token);
      ls.set("refresh_token", res.data.refresh_token);
      return res.data;
    })
    .catch(error => { throw error.response?.data || error; });
};