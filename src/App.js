import React from "react";
import { BrowserRouter as Router, Switch, Route, Redirect } from "react-router-dom";
import Home from "./pages/Home";
import Auth from "./pages/Auth";
import Likes from "./pages/Likes";
import AdminPanel from './pages/AdminPanel';

import PrivateRoute from "./PrivateRoute";
import AdminPrivateRoute from "./AdminPrivateRoute";

import "./App.css";

function App() {
  return (
    <Router>
      <Switch>
        <Route path="/auth" component={Auth} />
        <Route exact path="/">
          <Redirect to="/books" />
        </Route>
        <PrivateRoute path="/books" exact component={Home} />
        <PrivateRoute path="/likes" component={Likes} />

        <AdminPrivateRoute path="/admin" component={AdminPanel} />
      </Switch>
    </Router>
  );
}

export default App;
