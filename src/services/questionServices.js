import axios from "axios";

const api = import.meta.env.VITE_API_URL;

const getQuestion = async (token) => {
  try {
    const response = await axios.get(`${api}/question`, {
      headers: {
        "Authorization": token,
      }
    });
    
    return response.data;

  } catch (error) {
    console.log(error.response)
  }
}

const questionServices = {
  getQuestion,
};

export default questionServices;