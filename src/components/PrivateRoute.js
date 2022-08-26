import React from 'react';
import { Redirect, Route } from 'react-router-dom';
import { getCurrentUser } from '../services/authService';

const PrivateRoute = ({
  path,
  component: Component,
  render,
  role,
  roles,
  ...rest
}) => {
  const redirect = (props) => {
    return (
      <Redirect
        to={{
          pathname: '/login',
          state: { from: props.location }
        }}
      />
    );
  };
  return (
    <Route
      {...rest}
      render={(props) => {
        const user = getCurrentUser();
        if (!user) return redirect(props);

        //get allowed roles that match for the user (boolean)
        let isAllowed = roles.some((role) => user[role]);

        if (isAllowed) {
          return Component ? (
            <Component {...props} roles={user.roles} user={user} />
          ) : (
            render(props)
          );
        }

        return redirect(props);
      }}
    />
  );
};

export default PrivateRoute;
