import React from 'react';
import Labels from 'components/Labels';
import Overlays from 'components/Overlays';
import Canvas from 'components/Canvas';
import stateStore from 'app/stateStore';
import coinsContainer from 'app/components/Coins';
import _debounce from 'lodash/debounce';

class CanvasController extends React.Component {
  constructor(props) {
    super(props);
    this.handleLabelClick = this.handleLabelClick.bind(this);
  }
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

  handleLabelClick({key, value}) {
    const {state} = this.props;
    const coins = state.selectedCoins.length ? state.selectedCoins : coinsContainer.coins;
    const selectedCoins = coins.filter((coin) => coin.data[key] === value);
    stateStore.set({selectedCoins});
  }

  render() {
    const {state} = this.props;
    let className = "canvas-container";
    className += state.selecting ? " is-in-selection-mode" : "";
    return (
      <div ref={(root) => this.root = root} className={className}>
        {this.canvas && <Overlays transform={this.canvas.transform()}>
          <Labels onLabelClick={this.handleLabelClick} transform={this.canvas.transform()} labels={this.canvas.labels()}/>
        </Overlays>}
        {state.selecting && this.createSvgOverlay()}
      </div>
    );
  }
}

export default CanvasController;