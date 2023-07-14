import axios from "axios";
import { auth } from "../firebase";

export const https = (token) => {
  const client = axios.create({
    baseURL: process.env.REACT_APP_BACKEND_URL,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  console.log("ilk gelen token", token);

  const responseInterceptor = client.interceptors.response.use(
    (response) => response,
    async (error) => {
      if (error.response && error.response.status === 401) {
        console.log("401 Hatası! FirebaseToken yenileniyor...");
        console.log("eskitoken", token);
        console.log(error.response.config);
        try {
          const refreshedToken = await auth.currentUser.getIdToken(true);
          console.log("yenilenentoken", refreshedToken);

          // Create a new axios request and copy the first request
          const retryRequest = {
            ...error.config, // Copy the config of the first request
            headers: {
              ...error.config.headers, // Copy the headers of the first request
              Authorization: `Bearer ${refreshedToken}`, // Use the new token
            },
          };

          // Interceptor is removed after retry
          client.interceptors.response.eject(responseInterceptor);

          const retryResponse = await client.request(retryRequest);
          console.log("Yeniden deneme başarılı!", retryResponse.data);
          return retryResponse;
        } catch (retryError) {
          console.log("Yeniden deneme başarısız!", retryError);
          throw retryError;
        }
      }

      throw error;
    }
  );
  
  return client;
};
