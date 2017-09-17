import React from 'react';
import Labels from 'components/Labels';
import Overlays from 'components/Overlays';
import Canvas from 'components/Canvas';
import Tooltip from 'components/Tooltip';
import CoinInfo from 'components/CoinInfo';
import stateStore from 'app/stateStore';
import {loadingSteps} from 'constants';
import _find from 'lodash/find';

class CanvasController extends React.Component {
  constructor(props) {
    super(props);
    this.handleLabelClick = this.handleLabelClick.bind(this);
  }
  updateCanvas() {
    const {state} = this.props;
    const {canvas} = this;
    const renderNextFrame = stateStore.didPropertiesChange(['loadingProgress']);
    const shouldCanvasInitialize = stateStore.didPropertiesChange(['lowResLoaded']);
    const shouldCanvasUpdate = stateStore.didPropertiesChange([
      'selectedLayout',
      'selectedProperties',
      'selectedCoin',
      'selectedCoins',
      'width',
      'height',
      'coinFilters',
      'lowResLoaded',
      'showIntro'
    ]);

    canvas
      .size({
        width: state.width, 
        height: state.height
      });

    if(shouldCanvasInitialize)
      // wait a bit so not everything shows up at the same time
      window.setTimeout(() => canvas.initialize(), 400); 
    else if(shouldCanvasUpdate)
      canvas.update();
    else if(renderNextFrame)
      canvas.frame();
  }

  componentDidMount() {
    let {state} = this.props;
    this.canvas = Canvas();
    this.canvas
      .on('zoom', (transform) => stateStore.set({transform}))
      .on('initialized', this.props.onCanvasInitialized)
      .size({
        width: state.width, 
        height: state.height
      })(this.root);
  }

  componentDidUpdate() {
    this.updateCanvas();
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
    stateStore.set({
      coinFilters,
      hintStep: null,
      allHintsShown: state.hintStep === 2 ? true : false
    });
  }

  render() {
    const {state} = this.props;
    let className = 'canvas-container';
    className += state.hoveredCoin ? ' is-coin-hovered' : '';
    className += state.draggedCoin ? ' is-coin-dragged' : '';
    const showCoinInfo = state.selectedCoin && !state.transitioning;
    const showLabels = !state.transitioning;
    const showTooltip = state.hoveredCoin && !state.transitioning;

    return (
      <div ref={(root) => this.root = root} className={className}>
        {this.canvas && <Overlays transform={state.transform}>
          {showLabels && <Labels 
            onLabelClick={this.handleLabelClick} 
            transform={state.transform}
            bounds={this.canvas.bounds()}
            coinFilters={state.coinFilters}
            labels={this.canvas.labelGroups()}/>}
          {showTooltip && <Tooltip 
            coin={state.hoveredCoin}
            transform={state.transform}
            properties={state.selectedProperties}/>
          }
          {showCoinInfo && <CoinInfo 
            onLabelClick={this.handleLabelClick}
            coinFilters={state.coinFilters}
            coin={state.selectedCoin}
            transform={state.transform}/>}
        </Overlays>}
      </div>
    );
  }
}

export default CanvasController;