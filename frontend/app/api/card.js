import axios from "axios";

const api_url = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export const fetchCardData = async () => {
  try {
    const response = await axios.get(`${api_url}/expense/overview`);
    return response.data;
  } catch (error) {
    console.error("Error fetching card data:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Failed to fetch card data");
  }
};
