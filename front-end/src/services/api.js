import axios from 'axios';

const API_URL = 'http://localhost:3000';

export const getOrgChart = async () => {
  try {
    const response = await axios.get(`${API_URL}/orgchart`);
    return response.data;
  } catch (error) {
    console.error('Error fetching org chart:', error);
    throw error;
  }
};








