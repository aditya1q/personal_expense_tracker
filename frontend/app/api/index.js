const api_url = process.env.NEXT_PUBLIC_API_URL;

// Server-side fetch with caching
export const fetchCardData = async () => {
  const response = await fetch(`${api_url}/expense/overview`, {
    cache: 'force-cache', // Cache by default, adjust as needed
    next: { revalidate: 60 }, // Revalidate every 60 seconds
  });
  if (!response.ok) throw new Error('Failed to fetch card data');
  return response.json();
};

export const fetchExpenseOverview = async () => {
  const response = await fetch(`${api_url}/expense/transaction/chart`, {
    cache: 'force-cache',
    next: { revalidate: 60 },
  });
  if (!response.ok) throw new Error('Failed to fetch chart data');
  return response.json();
};

export const fetchTransactionData = async () => {
  const response = await fetch(`${api_url}/expense/transaction`, {
    cache: 'force-cache',
    next: { revalidate: 60 },
  });
  if (!response.ok) throw new Error('Failed to fetch transaction data');
  return response.json();
};

// Client-side axios for form submission
import axios from 'axios';

export const fetchTransactionForm = (formData) => {
  return axios.post(`${api_url}/expense/transaction`, formData)
    .then(res => res.data)
    .catch(error => { throw error.response?.data || error; });
};