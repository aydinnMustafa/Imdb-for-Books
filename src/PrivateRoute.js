import React, {useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { onAuthStateChanged } from "firebase/auth";
import { Route, Redirect } from "react-router-dom";
import { login, logout } from "./features/userSlice";


import { auth } from "./firebase";
import { selectUser, userStat } from "./features/userSlice";
import Loading from "./Components/Loading";

const PrivateRoute = ({ component: Component, ...rest }) => {
  const user = useSelector(selectUser);
  const dispatch = useDispatch();
  const userStatus = useSelector(userStat);

  useEffect(() => {
    onAuthStateChanged(auth, (userAuth) => {
      if (userAuth) {
          console.log(userAuth);
         dispatch(
           login({
             email: userAuth.email,
             uid: userAuth.uid,
             displayName: userAuth.displayName,
          })
         );
        
      } else {
        dispatch(logout());
      }
    });
  }, [dispatch]);
  

  console.log(user);

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
