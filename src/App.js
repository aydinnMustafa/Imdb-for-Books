import React, { useEffect }from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Home from "./pages/Home";
import Auth from "./pages/Auth";
import PrivateRoute from "./PrivateRoute";

import "./App.css";
import Header from "./pages/Header";


import { useDispatch, useSelector } from 'react-redux';
import { login, logout } from './features/userSlice';
import {onAuthStateChanged} from 'firebase/auth';
import {auth} from './firebase';
import { selectUser } from './features/userSlice';

function App() {
  const user = useSelector(selectUser);
  const dispatch = useDispatch();
 
  


  return (
    
      <Router>
        <Switch>
        <Route path="/auth" component={Auth} /> 

          <PrivateRoute path="/" exact component={Home} />
          <PrivateRoute path="/books" component={Header} />
          <PrivateRoute path="/likes" component={Home} />
        </Switch>
      </Router>
    
  );
}

export default App;
