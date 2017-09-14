import React from 'react';
import Labels from 'components/Labels';
import Overlays from 'components/Overlays';
import Canvas from 'components/Canvas';
import Tooltip from 'components/Tooltip';
import Intro from 'components/Intro';
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
    const arrangeAround = state.showIntro && this.getInfoContainerBounds();
    const shouldCanvasInitialize = stateStore.didPropertiesChange(['lowResLoaded']);
    const shouldCanvasUpdate = stateStore.didPropertiesChange([
      'selectedLayout',
      'selectedProperties',
      'selectedCoin',
      'selectedCoins',
      'width',
      'height',
      'coinFilters',
      'lowResLoaded'
    ]);

    this.canvas
      .size({
        width: state.width, 
        height: state.height
      });

    if(shouldCanvasInitialize) {
      this.canvas.initialize(arrangeAround);
      return;
    } else if(shouldCanvasUpdate) {
      this.canvas.update(arrangeAround);
    }
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

  getInfoContainerBounds() {
    const container = this.infoContainer.root;
    const {transform} = this.props.state;
    const width = container.offsetWidth;
    const height = container.offsetHeight;
    return {
      left: container.offsetLeft + transform.x,
      top: container.offsetTop + transform.y,
      right: container.offsetLeft + transform.x + width,
      bottom: container.offsetTop + transform.y + height
    }
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
    let className = 'canvas-container';
    const showCoinInfo = state.selectedCoin && !state.transitioning;
    const showLabels = !state.transitioning;
    const showTooltip = state.hoveredCoin && !state.transitioning;

    return (
      <div ref={(root) => this.root = root} className={className}>
        {this.canvas && <Overlays transform={state.transform}>
          {<Intro 
            transform={state.transform}
            bounds={this.canvas.bounds()}
            ref={(ref) => this.infoContainer = ref} />}
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
            coin={state.selectedCoin}
            transform={state.transform}/>}
        </Overlays>}
      </div>
    );
  }
}

export default CanvasController;