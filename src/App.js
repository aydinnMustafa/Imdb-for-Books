import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Home from "./pages/Home";
import Auth from "./pages/Auth";
import PrivateRoute from "./PrivateRoute";
import AuthContextProvider from "./shared/context/AuthContext";
import "./App.css";
import Header from "./pages/Header";

function App() {
  return (
    <AuthContextProvider>
      <Router>
        <Switch>
          <Route path="/auth" component={Auth} />

          <PrivateRoute path="/" exact component={Home} />
          <PrivateRoute path="/books" component={Header} />
          <PrivateRoute path="/likes" component={Home} />
        </Switch>
      </Router>
    </AuthContextProvider>
  );
}

export default App;
