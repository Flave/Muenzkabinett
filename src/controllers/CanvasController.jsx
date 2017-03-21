import React from 'react';
import Display from 'components/Canvas';
import stateStore from 'app/stateStore';
import _debounce from 'lodash/debounce';

class CanvasController extends React.Component {
  updateCanvas() {
    var shouldCanvasRelayout,
        state = this.props.state,
        canvasPropertiesChanged = stateStore.didPropertiesChange(['selectedLayout', 'coinsProgress', 'selectedProperties', 'selectedCoin', 'selectedCoins']);
    shouldCanvasRelayout = canvasPropertiesChanged && (state.coinsProgress === 1);
    this.resizeCanvas();
    this.display.update(shouldCanvasRelayout);
  }

  componentDidMount() {
    var debouncedUpdateCanvas = _debounce(this.updateCanvas, 500).bind(this);
    window.addEventListener('resize', debouncedUpdateCanvas);
    this.display = Display();
    this.display.on('zoom', function() {
      this.forceUpdate();
    }.bind(this));

    this.resizeCanvas();
    this.display(this.root);
  }

  componentDidUpdate(prevProps) {
    this.updateCanvas();
  }

  resizeCanvas() {
    var size = {
      width: window.innerWidth,
      height: window.innerHeight
    };
    this.display.size(size);
  }

  render() {
    return (
      <div ref={(root) => this.root = root} className="canvas-container"></div>
    );
  }
}

export default CanvasController;