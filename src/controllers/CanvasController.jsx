import React from 'react';
import Labels from 'components/Labels';
import Overlays from 'components/Overlays';
import Canvas from 'components/Canvas';
import stateStore from 'app/stateStore';
import _debounce from 'lodash/debounce';

class CanvasController extends React.Component {
  updateCanvas() {
    let shouldCanvasRelayout;
    let {state} = this.props;
    let canvasPropertiesChanged = stateStore.didPropertiesChange(['selectedLayout', 'coinsProgress', 'selectedProperties', 'selectedCoin', 'selectedCoins', 'width', 'height']);

    shouldCanvasRelayout = canvasPropertiesChanged && (state.coinsProgress === 1);

    this.canvas
      .size({
        width: state.width, 
        height: state.height
      })
      .update(shouldCanvasRelayout);
  }

  componentDidMount() {
    let {state} = this.props;
    this.canvas = Canvas();
    this.canvas.on('zoom', function() {
      this.forceUpdate();
    }.bind(this));

    this.canvas
      .size({
        width: state.width, 
        height: state.height
      })(this.root);
  }

  componentDidUpdate(prevProps) {
    this.updateCanvas();
  }

  createSvgOverlay() {
    const {state} = this.props;
    return (
      <svg 
        className="selection-overlay"
        width={state.width} 
        height={state.height}>
        <rect
          className="selection-overlay__frame"
          width={state.width - 20}
          height={state.height - 20}
          x={10}
          y={10}
        ></rect>
      </svg>
    )
  }

  render() {
    const {state} = this.props;
    let className = "canvas-container";
    className += state.selecting ? " is-in-selection-mode" : "";
    return (
      <div ref={(root) => this.root = root} className={className}>
        {this.canvas && <Overlays transform={this.canvas.transform()}>
          <Labels transform={this.canvas.transform()} labels={this.canvas.labels()}/>
        </Overlays>}
        {state.selecting && this.createSvgOverlay()}
      </div>
    );
  }
}

export default CanvasController;