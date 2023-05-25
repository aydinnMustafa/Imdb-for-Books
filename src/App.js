import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Redirect,
} from "react-router-dom";
import Home from "./pages/Home";
import Auth from "./pages/Auth";
import Favorites from "./pages/Favorites";
import AdminPanel from "./pages/AdminPanel";
import BookDetail from "./pages/BookDetail";
import Profile from "./pages/Profile";

import PrivateRoute from "./PrivateRoute";
import AdminPrivateRoute from "./AdminPrivateRoute";

import "./App.css";

function App() {
  return (
    <Router>
      <Route path="/auth" component={Auth} />
      <Route exact path="/">
        <Redirect to="/books" />
      </Route>
      <PrivateRoute path="/books" exact component={Home} />
      <PrivateRoute path="/favorites" component={Favorites} />
      <PrivateRoute path="/books/:id" component={BookDetail} />
      <PrivateRoute path="/profile" component={Profile} />
      <AdminPrivateRoute path="/admin" component={AdminPanel} />
      
    </Router>
  );
}

export default App;
