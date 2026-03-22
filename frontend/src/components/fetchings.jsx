import axios from "axios";

const homefetch = async () => {
  try {
    const accessToken = localStorage.getItem("access_token");
    const { data } = await axios.get("http://127.0.0.1:8000/api/token/refresh/", {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });

    console.log("Fetched Message:", data.message);
    return data.message;
  } catch (error) {
    console.error("HomeFetch failed:", error.response?.data || error.message);
    return null;
  }
};

export default homefetch;
