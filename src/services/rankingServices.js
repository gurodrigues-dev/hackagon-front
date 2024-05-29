import axios from "axios";

const api = import.meta.env.VITE_API_URL;

const getRanking = async (token) => {
  try {
    const response = await axios.get(`${api}/rank`, {
      headers: {
        "Authorization": token,
      }
    });
    
    return response.data;

  } catch (error) {
    return { error: error.message }
  }
}

const rankingServices = {
  getRanking,
};

export default rankingServices;