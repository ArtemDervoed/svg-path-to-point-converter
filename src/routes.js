import HomePage from '_pages/HomePage';
import LoaderSVGPage from '_pages/LoaderSVGPage';

export default [
  {
    path: '/',
    exact: true,
    cache: false,
    component: HomePage,
  },
  {
    path: '/loader',
    exact: true,
    cache: false,
    component: LoaderSVGPage,
  },
];
