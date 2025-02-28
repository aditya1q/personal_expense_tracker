import axios from "axios";

const api_url = process.env.NEXT_PUBLIC_API_URL;

export const fetchRegisterUser = (userData) => {
  return axios.post(`${api_url}/v1/register`, userData)
    .then(res => {
      console.log("Register User API Response:", res.data);
      return res.data;
    })
    .catch(error => {
      console.error("Registration Error:", error.response?.data || error.message);
      throw error.response?.data || error;
    });
};


export const fetchLoginUser = (loginData) => {
  return axios.post(`${api_url}/v1/login`, loginData)
    .then(res => {
      console.log("Login API Response:", res.data);
      return res.data
    })
    .catch(error => {
      console.error("Login Error:", error.response?.data || error.message);
      throw error.response?.data || error;
    });
}


export const fetchRefershToken = (refershToken) => {
  return axios.post(`${api_url}/v1/refersh`, refershToken)
    .then(res => {
      console.log('Refersh Token API Response', res.data)
      return res.data
    })
    .catch(error => {
      console.error("Refersh Token Error:", error.response?.data || error.message);
      throw error.response?.data || error;
    });
}