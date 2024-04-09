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
    
    if(response.data) {   
      const date = new Date();
      const dateExpiration = new Date(date.getTime() + 1 * 60000)
      
      const dataUser = {
        token: {
          value: response.data.token,
          expiration: dateExpiration.getTime()
        },
        user: {...response.data.user}
      };

      localStorage.setItem("data", JSON.stringify(dataUser));
      
      return dataUser;
    }

  } catch (error) {
    return { error: error.message}
  }
}

const logout = () => {
  localStorage.removeItem("data");
}

const authService = {
  register,
  login,
  logout,
}

export default authService;