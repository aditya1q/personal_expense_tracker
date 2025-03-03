import axios from "axios";
const api_url = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";


export const fetchExpenseOverview = () => {
    return axios.get(`${api_url}/expense/transaction/chart`)
        .then(res => res.data)
        .catch(error => { throw error.response?.data || error; });
}