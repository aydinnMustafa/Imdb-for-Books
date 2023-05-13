import React, { useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { onAuthStateChanged } from "firebase/auth";
import { Route, Redirect } from "react-router-dom";

import { auth } from "./firebase";
import { login, logout, userStat } from "./features/userSlice";
import Loading from "./Components/Loading";


const PrivateRoute = ({ component: Component, ...rest }) => {
  const dispatch = useDispatch();
  const userStatus = useSelector(userStat);
  
  const fetchData = useCallback(() => {
    onAuthStateChanged(auth, (userAuth) => {
      if (userAuth) {
        userAuth.getIdToken().then((token) => {
          console.log(token);
          dispatch(
            login({
              email: userAuth.email,
              uid: userAuth.uid,
              displayName: userAuth.displayName,
            })
          );
          
          // axios
          //   .post(
          //     "http://localhost:5000/books",
          //     { _id: userAuth.uid },
          //     {
          //       headers: {
          //         Authorization: `Bearer ${token}`,
          //         "Content-Type": "application/json",
          //       },
          //     }
          //   )
          //   .then((response) => {
          //     let userToken = response.data.token;
          //       console.log(userToken);
          //     let userRole = jwtDecode(userToken).role;
          //     dispatch(
          //       login({
          //         email: userAuth.email,
          //         uid: userAuth.uid,
          //         displayName: userAuth.displayName,
          //         role: userRole,
          //       })
          //     );
          //   });
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
