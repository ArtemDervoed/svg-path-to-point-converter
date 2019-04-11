import React, { Fragment } from 'react';
import Helmet from 'react-helmet';
import RendererMorph from '_components/RendererMorph';

const HomePage = () => (
  <Fragment>
    <Helmet title="Home" />
    <RendererMorph />
  </Fragment>
);

export default HomePage;
