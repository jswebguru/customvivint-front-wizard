import axios from "axios";

const apiClient = axios.create({
  // baseURL: process.env.REACT_APP_API_URL,
  baseURL: "https://custom-vivint-backend.graphgenie.app/api/v1",
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    console.error("API call failed:", error);
    // Handle specific error cases
    if (error.response.status === 401) {
      alert("Unauthorized");
    } else if (error.response.status === 404) {
      alert("Not found");
    }
    return Promise.reject(error);
  }
);

export default apiClient;
