import React from 'react';
import Labels from 'components/Labels';
import Overlays from 'components/Overlays';
import Canvas from 'components/Canvas';
import Tooltip from 'components/Tooltip';
import CoinInfo from 'components/CoinInfo';
import stateStore from 'app/stateStore';
import coinsContainer from 'app/components/Coins';
import _debounce from 'lodash/debounce';
import _find from 'lodash/find';
import _merge from 'lodash/merge';

class CanvasController extends React.Component {
  constructor(props) {
    super(props);
    this.handleLabelClick = this.handleLabelClick.bind(this);
  }
  updateCanvas() {
    let shouldCanvasRelayout;
    let {state} = this.props;
    let canvasPropertiesChanged = stateStore.didPropertiesChange([
      'selectedLayout',
      'coinsProgress',
      'selectedProperties',
      'selectedCoin',
      'selectedCoins',
      'width',
      'height',
      'coinFilters'
    ]);

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
    this.canvas
      .on('zoom', (transform) => stateStore.set({transform}));

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

  handleLabelClick(labels) {
    const {state} = this.props;
    let coinFilters = state.coinFilters.slice();
    labels.forEach(({key, value}) => {
      const currentFilter = _find(coinFilters, {key, value});
      if(!currentFilter) {
        coinFilters.push({key, value});
      } else {
        const index = coinFilters.indexOf(currentFilter);
        coinFilters.splice(index, 1);
      }
    });
    stateStore.set({coinFilters});
  }

  render() {
    const {state} = this.props;
    let className = "canvas-container";
    const showCoinInfo = state.selectedCoin && !state.transitioning;
    const showLabels = !state.transitioning;
    const showTooltip = state.hoveredCoin && !state.transitioning;
    className += state.selecting ? " is-in-selection-mode" : "";


    return (
      <div ref={(root) => this.root = root} className={className}>
        {this.canvas && <Overlays transform={state.transform}>
          {showLabels && <Labels 
              onLabelClick={this.handleLabelClick} 
              transform={state.transform}
              bounds={this.canvas.bounds()}
              labels={this.canvas.labelGroups()}/>}
          {showTooltip && <Tooltip 
            coin={state.hoveredCoin}
            transform={state.transform}
            properties={state.selectedProperties}/>
          }
          {showCoinInfo && <CoinInfo 
            coin={state.selectedCoin}
            transform={state.transform}/>}
        </Overlays>}
        {state.selecting && this.createSvgOverlay()}
      </div>
    );
  }
}

export default CanvasController;