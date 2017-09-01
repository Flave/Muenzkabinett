import React from 'react';
import Ui from 'controllers/Ui';
import { MARGIN } from 'constants/dimensions';
import CanvasController from 'controllers/CanvasController';
import IntroController from 'controllers/IntroController';
import LoadingIndicator from 'components/LoadingIndicator';
import stateStore from 'app/stateStore';
import loader from 'utility/loader';
import _debounce from 'lodash/debounce';

class App extends React.Component {
  componentWillMount() {
    loader.load();
    stateStore.on('change.app', function() {
      var state = stateStore.get();
      if(state.coinsProgress === 1)
        this.forceUpdate();
    }.bind(this));

    var debouncedResize = _debounce(this.resize, 500).bind(this);
    window.addEventListener('resize', debouncedResize);
  }

  resize() {
    stateStore.set({
      width: window.innerWidth,
      height: window.innerHeight - MARGIN.BOTTOM
    });
  }

  render() {
    var state = stateStore.get();
    return (
      <div className="app">
        {state.showUi && <Ui state={state} />}
        <CanvasController state={state} />
        {!state.onboardingComplete && <IntroController state={state} />}
        {!state.canvasInitialized && <LoadingIndicator state={state}/>}
      </div>
    );
  }
}

export default App;