import React from 'react';
import Canvas from 'components/Canvas';
import stateStore from 'app/stateStore';
import _debounce from 'lodash/debounce';

class CanvasController extends React.Component {
  updateCanvas() {
    let shouldCanvasRelayout;
    let state = this.props.state;
    let canvasPropertiesChanged = stateStore.didPropertiesChange(['selectedLayout', 'coinsProgress', 'selectedProperties', 'selectedCoin', 'selectedCoins']);

    shouldCanvasRelayout = canvasPropertiesChanged && (state.coinsProgress === 1);
    this.resizeCanvas();
    this.canvas.update(shouldCanvasRelayout);
  }

  componentDidMount() {
    var debouncedUpdateCanvas = _debounce(this.updateCanvas, 500).bind(this);
    window.addEventListener('resize', debouncedUpdateCanvas);
    this.canvas = Canvas();
    this.canvas.on('zoom', function() {
      this.forceUpdate();
    }.bind(this));

    this.resizeCanvas();
    this.canvas(this.root);
  }

  componentDidUpdate(prevProps) {
    this.updateCanvas();
  }

  resizeCanvas() {
    var size = {
      width: window.innerWidth,
      height: window.innerHeight
    };
    this.canvas.size(size);
  }

  render() {
    return (
      <div ref={(root) => this.root = root} className="canvas-container"></div>
    );
  }
}

export default CanvasController;