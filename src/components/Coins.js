import {Container} from 'pixi.js';
import stateStore from 'app/stateStore';
import rebind from 'utility/rebind';
import {dispatch as d3_dispatch} from 'd3-dispatch';

var coinsContainer = {},
  coins = [],
  parent,
  dispatch = d3_dispatch('dragstart', 'dragend', 'click'),
  stage = new Container();

stage.interactiveChildren = true;

function handleCoinClick() {
  var state = stateStore.get();
  if(state.selectedCoin && (state.selectedCoin.data.id === this.data.id))
    stateStore.set({'selectedCoin': null});
  else
    stateStore.set({'selectedCoin': this});
}

function handleCoinDragStart(coin) {
  dispatch.call('dragstart');
  // unset hovered coin so tooltip disapears during dragging
  stateStore.set({hoveredCoin: null, draggedCoin: coin});
}

function handleCoinDragEnd(coin) {
  dispatch.call('dragend');
  // set hovered coin so tooltip reappears during dragging
  stateStore.set({hoveredCoin: coin, draggedCoin: null});
}

function handleCoinMouseEnter(coin) {
  if(!stateStore.get().draggedCoin)
    stateStore.set({hoveredCoin: coin});
}

function handleCoinMouseLeave(coin) {
  const {hoveredCoin, draggedCoin} = stateStore.get();
  // if mouse leaves coin and enters next coin in same moment, we need to check if they are the same
  // if dragged hoveredCoin is set to null as well. So we need to check if it is still set.
  if(hoveredCoin && (hoveredCoin.data.id === coin.data.id) && !draggedCoin)
    stateStore.set({hoveredCoin: null});
}

coinsContainer.add = function(coin) {
  coins.push(coin);
  coin.parentTransform(parent.transform.localTransform);
  stage.addChild(coin);
  coin
    .on('dragstart', handleCoinDragStart)
    .on('dragend', handleCoinDragEnd)
    .on('click', handleCoinClick)
    .on('mouseenter', handleCoinMouseEnter)
    .on('mouseleave', handleCoinMouseLeave)
}

coinsContainer.parent = function(_) {
  if(!arguments.length) return parent;
  parent = _;
  parent.addChild(stage);
  return coinsContainer;
}

coinsContainer.stage = stage;
coinsContainer.coins = coins;

export default rebind(coinsContainer, dispatch, 'on');