import React, { useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { onAuthStateChanged } from "firebase/auth";
import { Route, Redirect } from "react-router-dom";

import { auth } from "./firebase";
import { login, logout, userStat, selectUser } from "./features/userSlice";
import Loading from "./Components/Loading";
import jwtDecode from "jwt-decode";

const AdminPrivateRoute = ({ component: Component, ...rest }) => {
  const dispatch = useDispatch();
  const userStatus = useSelector(userStat);
  const userSelect = useSelector(selectUser);
  

  const fetchData = useCallback(() => {
    onAuthStateChanged(auth, (userAuth) => {
      if (userAuth) {
        userAuth.getIdToken().then((token) => {
        let decodeUserRole = jwtDecode(token).role;
          dispatch(
            login({
              email: userAuth.email,
              uid: userAuth.uid,
              displayName: userAuth.displayName,
              role: decodeUserRole
              
            })
          );
        //   axios
        //     .post(
        //       "http://localhost:5000/books",
        //       { userId: userAuth.uid },
        //       {
        //         headers: {
        //           Authorization: `Bearer ${token}`,
        //           "Content-Type": "application/json",
        //         },
        //       }
        //     )
        //     .then((response) => {
        //       const userToken = response.data.token;
  
        //       let userRole = jwtDecode(userToken).claims.role;
        //       dispatch(
        //         login({
        //           email: userAuth.email,
        //           uid: userAuth.uid,
        //           displayName: userAuth.displayName,
        //           role: userRole,
        //         })
        //       );
        //     });
        // });
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
      render={(props) => {
        if (userStatus == null) {
          return <Loading />;
        } else if (userStatus === "connect" && userSelect.role === "user") {
          return <Component {...props} />;
        } else {
          return <Redirect to="/books" />;
        }
      }}
    />
  );
};

export default AdminPrivateRoute;
