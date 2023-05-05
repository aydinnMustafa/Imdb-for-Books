import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import PrivateRoute from "./PrivateRoute";
import AuthContextProvider from "./shared/context/AuthContext";
import "./App.css";
import Header from "./pages/Header";

function App() {
  return (
    <AuthContextProvider>
      <Router>
        <Switch>
          <Route path="/auth" component={Login} />

          <PrivateRoute path="/" exact component={Home} />
          <PrivateRoute path="/books" component={Header} />
          <PrivateRoute path="/likes" component={Home} />
        </Switch>
      </Router>
    </AuthContextProvider>
  );
}
// <Router>
//   <AuthReducer>
//      <AuthContext.Consumer>
//       {({ state }) =>
//         !state.isAuthenticated ? (
//           <Navigate exact to="/login" />
//         ) : (
//           <Navigate exact to="/" />
//         )
//       }
//     </AuthContext.Consumer>
//     <Routes>
//       <Route exact path="/login" element={<Login />} />
//       <Route exact path="/" element={<Home />} />

//     </Routes>
//   </AuthReducer>
// </Router>

export default App;
