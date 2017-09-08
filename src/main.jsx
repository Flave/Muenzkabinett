// eslint-disable-next-line no-unused-vars
import css from './style/index.scss';
import {render} from 'react-dom';
import React from 'react';
import App from 'controllers/App';

render(
  <App />,
  document.getElementById('container')
);