import axios from 'axios';
const api_url = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export const fetchTransactionForm = (formData) => {
    return axios.post(`${api_url}/expense/transaction`, formData)
        .then(res => res.data)
        .catch(error => { throw error.response?.data || error; });
}

export const fetchTransactionData = () => {
    return axios.get(`${api_url}/expense/transaction`)
        .then(res => res.data)
        .catch(error => { throw error.response?.data || error; });
}