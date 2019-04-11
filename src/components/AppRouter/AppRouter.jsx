import React from 'react';
import PropTypes from 'prop-types';
import { Switch, Route } from 'react-router-dom';

const Router = ({ routes }) => (
  <Switch>
    {routes.map(({ path, exact, component: Component }) => (
      <Route
        key={path}
        exact={exact}
        path={path}
        render={props => <Component {...props} />}
      />
    ))}
  </Switch>
);

Router.propTypes = {
  routes: PropTypes.array,
};

export default Router;
