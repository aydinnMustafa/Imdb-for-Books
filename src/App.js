import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Switch,
} from "react-router-dom";

import Home from "./pages/Home";
import Auth from "./pages/Auth";
import Favorites from "./pages/Favorites";
import AdminPanel from "./pages/AdminPanel";
import BookDetail from "./pages/BookDetail";
import Profile from "./pages/Profile";
import Page404 from "./pages/Page404";

import PrivateRoute from "./PrivateRoute";
import AdminPrivateRoute from "./AdminPrivateRoute";
import { AbilityContext } from "./features/can";
import buildAbility from "./features/userAbility";
import { selectUser } from "./features/userSlice";
import { useSelector } from "react-redux";

import "./App.css";

function App() {
  const user = useSelector(selectUser);

  const userAbilitiesMain = user ? buildAbility(user.role) : null; // Controls the user's role via the redux store, and if the role is available, ability works with that role
  return (
    <AbilityContext.Provider value={userAbilitiesMain}>
      <Router>
        <Switch>
          <Route path="/auth" component={Auth} />
          <Route exact path="/">
            <Redirect to="/books" />
          </Route>
          <PrivateRoute path="/books" exact component={Home} />
          <PrivateRoute path="/favorites" component={Favorites} />
          <PrivateRoute path="/books/:id" component={BookDetail} />
          <PrivateRoute path="/profile" component={Profile} />
          <AdminPrivateRoute path="/admin" component={AdminPanel} />
          <Route component={Page404} />
        </Switch>
      </Router>
    </AbilityContext.Provider>
  );
}

export default App;
