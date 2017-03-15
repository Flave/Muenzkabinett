import css from './style/index.scss';
import {render} from 'react-dom';
import React from 'react';
import App from 'controllers/App';

render(
  <App />,
  document.getElementById('container')
);

/*import Canvas from 'components/Canvas';
import loader from 'utility/loader';
import stateStore from 'app/stateStore';

var canvas = Canvas();

loader.load();
stateStore.on('change.app', function() {
  var state = stateStore.get();
  if(state.coinsProgress === 1)
    canvas.size({width: window.innerWidth, height: window.innerHeight})(document.getElementById('container')).update();
}.bind(this));

document.addEventListener('click', canvas.update);*/