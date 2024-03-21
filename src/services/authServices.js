import axios from "axios";

const api = import.meta.env.VITE_API_URL;

const register = async ({ nickname, email, password }) => {

  try {
    const response = await axios.post(`${api}/user`,
      JSON.stringify({ nickname, email, password }),
      { "Content-Type": "application/json" },
    );

    return response.data;

  } catch (error) {
    console.log(error);
  }
}

const login = async ({nickname, password}) => {
  try {
    const response = await axios.post(`${api}/login`,
      JSON.stringify({ nickname, password }),
      { "Content-Type": "application/json" },
    );

    if(response) {
      localStorage.setItem("user", JSON.stringify(response.data));
    }

    return response.data;

  } catch (error) {
    return { error: error.message}
  }
}

const authService = {
  register,
  login
}

export default authService;