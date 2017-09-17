import React from 'react';
import { MARGIN, loadingSteps } from 'constants';
import Ui from 'controllers/Ui';
import CanvasController from 'controllers/CanvasController';
import Intro from 'components/Intro';
import Info from 'components/Info';
import Menu from 'components/Menu';
import Hints from 'controllers/Hints';
import {event as d3_event} from 'd3-selection';
import {csv as d3_csv} from 'd3-request';
import stateStore from 'app/stateStore';
import loader from 'utility/loader';
import _debounce from 'lodash/debounce';

class App extends React.Component {
  componentWillMount() {
    loader.load();
    stateStore.on('change.app', function() {
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

  componentDidUpdate() {
    if(stateStore.get().lowResLoaded) {
      const spinner = document.getElementById('initial-spinner');
      spinner && document.body.removeChild(spinner);
    }
  }

  handleCanvasInitialized() {
    window.setTimeout(() => {
      loader.loadHighRes();
    }, 200);
  }

  render() {
    var state = stateStore.get();
    return (
      <div className="app">
        {!state.showIntro && <Ui/>}
        {<CanvasController onCanvasInitialized={this.handleCanvasInitialized} state={state} />}
        <Menu />
        {state.showIntro && state.lowResLoaded && <Intro />}
        {state.showInfo && <Info />}
        {!state.allHintsShown && <Hints
          layout={state.selectedLayout} 
          hintStep={state.hintStep}
          showHints={state.showHints}/>}
      </div>
    );
  }
}

export default App;