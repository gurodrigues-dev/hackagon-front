import axios from "axios";

const api = import.meta.env.VITE_API_URL;

const sendCodeToEmail = async (email) => {
  try {
    console.log(email)
    const response =  await axios.post(`${api}/password`,
      JSON.stringify({ email }),
      { "Content-Type": "application/json" },
    );

    console.log(response)

    return response;

  } catch (error) {
    return { error: error.message };
  }
};

const verificationCode = async({ code, email }) => {
  try {
    const response = await axios.get(`${api}/password/${code}`, { 
        headers: {
          "account": email 
        }
      }
    );

    return response;

  } catch (error) {
    return { error: error.message }
  }
}

const changePassword = async ({ password, email }) => {
  try {
    const response =  await axios.patch(`${api}/password`,
      JSON.stringify({ password }),
      {
        headers: { 
        "Content-Type": "application/json",
        "account": email 
        }
      }
    );

    return response;

  } catch (error) {
    return { error: error.message}
  }
}

const passwordServices = {
  sendCodeToEmail,
  verificationCode,
  changePassword
};

export default passwordServices;