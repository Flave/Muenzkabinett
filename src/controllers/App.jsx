import React from 'react';
import Ui from 'controllers/Ui';
import CanvasController from 'controllers/CanvasController';
import IntroController from 'controllers/IntroController';
import LoadingIndicator from 'components/LoadingIndicator';
import stateStore from 'app/stateStore';
import loader from 'utility/loader';

class App extends React.Component {
  componentWillMount() {
    loader.load();
    stateStore.on('change.app', function() {
      var state = stateStore.get();
      if(state.coinsProgress === 1)
        this.forceUpdate();
    }.bind(this));
  }

  render() {
    var state = stateStore.get();
    return (
      <div className="app">
        {/*state.showUi && <Ui state={state} />*/}
        <CanvasController state={state} />
        {!state.onboardingComplete && <IntroController state={state} />}
        {!state.canvasInitialized && <LoadingIndicator state={state}/>}
      </div>
    );
  }
}

export default App;