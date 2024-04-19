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
    return { error: error.message }
  }
}

const createQuestion = async ({ username, password, title, description, level, date, inputs }) => {
  try {
    console.log("Services")
    const response = await axios.post(`${api}/question`,
      JSON.stringify({ username, password, title, description, level, date, inputs }),
      { "Content-Type": "application/json" }
    )

    return response.data

  } catch (error) {
    return { error: error.message }
  }
}

const answerQuestion = async ({ status, questionid, points }, token) => {
  try {
    const response = await axios.post(`${api}/answer`, JSON.stringify({ status, questionid, points }), {
      headers: {
        "Content-Type": "application/json",
        "Authorization": token,
      }
    })
    
    return response.data;

  } catch (error) {
    return error;
  }
}

const questionServices = {
  getQuestion,
  createQuestion,
  answerQuestion
};

export default questionServices;