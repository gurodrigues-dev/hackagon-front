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
    console.log(error)
    return { error: error.message }
  }
}

const createQuestion = async ({ username, password, title, description, level, date, inputs }) => {
  try {
    const response =  await axios.post(`${api}/question`, 
      JSON.stringify({ username, password, title, description, level, date, inputs }),
      { "Content-Type": "application/json" }
    )

    return response.data
    
  } catch (error) {
    return { error: error.message }
  }
}

const questionServices = {
  getQuestion,
  createQuestion,
};

export default questionServices;