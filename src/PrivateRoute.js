import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { AuthContext } from "./shared/context/AuthContext";


const PrivateRoute = ({component: Component, ...rest}) => {
    const { state} = React.useContext(AuthContext);
    const isAuthenticated = state.isAuthenticated;
    return (
        <Route {...rest} render={props => (
            isAuthenticated ? <Component {...props} /> : <Redirect to="/auth" />
        )} />
    );
};



export default PrivateRoute;