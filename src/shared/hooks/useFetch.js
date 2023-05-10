import { useState } from "react";
import axios from "axios";

const useFetch = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const get = async (url, token) => {
    setLoading(true);
    try {
      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setData(response.data);
    } catch (error) {
      setError(error);
    }
    setLoading(false);
  };

  const post = async (url, body, token) => {
    setLoading(true);
    try {
      const headers = {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
      };

      let response;
    if (body) {
      response = await axios.post(url, body, { headers });
    } else {
      response = await axios.post(url, { headers });
    }
      
      
      
      setData(response.data);
  } catch (error) {
      setError(error);
  }
  setLoading(false);
  };

  return { data, loading, error, get, post };
};

export default useFetch;
