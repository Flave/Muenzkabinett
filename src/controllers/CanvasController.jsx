import React from 'react';
import Display from 'components/Canvas';
import stateStore from 'app/stateStore';
import coinsStore from 'app/coinsStore';
import _debounce from 'lodash/debounce';

class CanvasController extends React.Component {
  updateCanvas() {
    this.resizeCanvas();
    this.display.update();
  }

  componentDidMount() {
    var debouncedUpdateCanvas = _debounce(this.updateCanvas, 500).bind(this);
    window.addEventListener('resize', debouncedUpdateCanvas);
    this.display = Display();
    this.resizeCanvas();
    this.display(this.root);
  }

  componentDidUpdate() {
    if(stateStore.get().coinsProgress === 1)
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