import React, { useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { onAuthStateChanged } from "firebase/auth";
import { Route, Redirect } from "react-router-dom";

import { auth } from "./firebase";
import { login, logout, userStat } from "./features/userSlice";
import Loading from "./Components/Loading";
import jwtDecode from "jwt-decode";

const PrivateRoute = ({ component: Component, ...rest }) => {
  const dispatch = useDispatch();
  const userStatus = useSelector(userStat);
  

  const fetchData = useCallback(() => {
    onAuthStateChanged(auth, (userAuth) => {
      if (userAuth) {
        console.log(userAuth);
        userAuth.getIdToken().then((token) => {
          let decodedUserRole = jwtDecode(token).role;
          dispatch(
            login({
              email: userAuth.email,
              uid: userAuth.uid,
              displayName: userAuth.displayName,
              role: decodedUserRole,
            })
          );
        });
      } else {
        dispatch(logout());
      }
    });
  }, [dispatch]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

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
