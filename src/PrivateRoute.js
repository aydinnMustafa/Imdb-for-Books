import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { onAuthStateChanged } from "firebase/auth";
import { Route, Redirect } from "react-router-dom";
import { login, logout } from "./features/userSlice";

import { auth } from "./firebase";
import { userStat } from "./features/userSlice";
import Loading from "./Components/Loading";
import jwtDecode from "jwt-decode";
import axios from "axios";

const PrivateRoute = ({ component: Component, ...rest }) => {
  const dispatch = useDispatch();
  const userStatus = useSelector(userStat);
  const [token, setToken] = useState();

  useEffect(() => {
    onAuthStateChanged(auth, (userAuth) => {
      if (userAuth) {
        dispatch(
          login({
            email: userAuth.email,
            uid: userAuth.uid,
            displayName: userAuth.displayName,
          })
        );
        userAuth.getIdToken().then((token) => {
          setToken(token);
          async function fetch() {
            try {
              axios
                .post(
                  "http://localhost:5000/books",
                  { userId: userAuth.uid },
                  {
                    headers: {
                      Authorization: `Bearer ${token}`,
                      "Content-Type": "application/json",
                    },
                  }
                )
                .then((response) => {
                  const userToken = response.data.token;
                  let user = jwtDecode(userToken);
                  console.log(user);
                });
            } catch (err) {
              console.error(err);
            }
          }
          fetch();
        });
      } else {
        dispatch(logout());
      }
    });
  }, [dispatch]);

  return (
    <Route
      {...rest}
      render={(props) =>
        userStatus == null ? (
          <Loading />
        ) : userStatus === "connect" ? (
          <Component {...props} />
        ) : (
          <Redirect to="/auth" />
        )
      }
    />
  );
};

export default PrivateRoute;
