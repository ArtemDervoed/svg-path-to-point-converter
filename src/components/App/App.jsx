
import React from 'react';
import { compose } from 'redux';
import CSSModules from 'react-css-modules';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';

import config from '_config';
import browserHOC from '_hocs/browser';

import AppRouter from '_components/AppRouter';
import '_styles/normalize.scss';
import styles from './App.scss';

const App = ({ routes }) => (
  <div styleName="app">
    <Helmet {...config.app} />
    <AppRouter routes={routes} />
  </div>
);

App.propTypes = {
  routes: PropTypes.array,
};

export default compose(
  browserHOC,
  Component => CSSModules(Component, styles),
)(App);
