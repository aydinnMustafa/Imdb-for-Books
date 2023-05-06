import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { login, logout, selectUser } from './features/userSlice';
import {onAuthStateChanged} from 'firebase/auth';
import {auth} from './firebase';

import { Route, Redirect } from 'react-router-dom';


const PrivateRoute = ({component: Component, ...rest}) => {

    const user = useSelector(selectUser);
    const dispatch = useDispatch();
  
  // check at page load if a user is authenticated
    useEffect(() => {
      onAuthStateChanged(auth, (userAuth) => {
        if (userAuth) {
          // user is logged in, send the user's details to redux, store the current user in the state
          dispatch(
            login({
              email: userAuth.email,
              uid: userAuth.uid,
              displayName: userAuth.displayName,
              photoUrl: userAuth.photoURL,
            })
          );
        } else {
          dispatch(logout());
        }
      });
    }, []);

    return (
        <Route {...rest} render={props => (
            user ? <Component {...props} /> : <Redirect to="/auth" />
        )} />
    );
};



export default PrivateRoute;