import axios from "axios";
import { auth } from "../firebase";

export const https = (token) => {
  const client = axios.create({
    baseURL: process.env.REACT_APP_BACKEND_URL,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  /* 
Firebase token expires after one hour. If the user stays on the same page for 1 hour and sends a request, he gets a error because the token has expired.
To fix this problem, if the response 401 is returned from the API, we create a new token and send the request again.
*/
  const responseInterceptor = client.interceptors.response.use(
    (response) => response,
    async (error) => {
      if (error.response && error.response.status === 401) {
        console.log("Error 401. Refreshing firebase Token...");
        try {
          const refreshedToken = await auth.currentUser.getIdToken(true);

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
          return retryResponse;
        } catch (retryError) {
          throw retryError;
        }
      }

      throw error;
    }
  );

  return client;
};
