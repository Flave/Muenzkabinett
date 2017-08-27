import {Point, Matrix, Texture, utils, Sprite, autoDetectRenderer, Container, Rectangle} from 'pixi.js';
import coinsStore from 'app/coinsStore';
import stateStore from 'app/stateStore';
import layouter from 'app/layouts';
import pile from 'app/layouts/pile';
import rebind from 'utility/rebind';
import {dispatch as d3_dispatch} from 'd3-dispatch';
//import coinInfo from 'app/components/CoinInfo';
import _find from 'lodash/find';

var coinsContainer = {},
    coins = [],
    parent,
    dispatch = d3_dispatch('dragstart', 'dragend', 'click'),
    interactive = false,
    stage = new Container();

stage.interactiveChildren = true;

function updateCoinInfo() {
  var state = stateStore.get(),
      coins = coinsStore.get();

  if(state.selectedCoin !== null) {
    var coin = _find(coins, function(coin) {return coin.data.id === state.selectedCoin});
    //coinInfo.show(coin, stage.transform);
  } else {
    //coinInfo.hide();
  }
}

function handleCoinClick() {
  var state = stateStore.get();
  //coinInfo.hide();
  if(state.selectedCoin === this.data.id)
    stateStore.set({'selectedCoin': null});
  else
    stateStore.set({'selectedCoin': this.data.id});
}

function handleCoinDragStart() {
  dispatch.call('dragstart');
}

function handleCoinDragEnd() {
  dispatch.call('dragend');
}

coinsContainer.add = function(coin) {
  coins.push(coin);
  coin.parentTransform(parent.transform.localTransform);
  stage.addChild(coin);
}

function toggleInteractivity() {
  coins.forEach((coin, i) => {
    if(interactive) {
      coin
        .on('dragstart', handleCoinDragStart)
        .on('dragend', handleCoinDragEnd)
        .on('click', handleCoinClick);
    }
    else {
      coin
        .off('dragstart', handleCoinDragStart)
        .off('dragend', handleCoinDragEnd)
        .off('click', handleCoinClick);
    }
  });
}

function bringToFront() {
  parent.removeChild(stage);
  parent.addChild(stage);
}

coinsContainer.parent = function(_) {
  if(!arguments.length) return parent;
  parent = _;
  return coinsContainer;
}

// Updates whether or not canvas should be interactive
coinsContainer.update = function(activateInteractivity) {
  if(interactive === activateInteractivity) return;
  interactive = activateInteractivity;
  toggleInteractivity();

  if(interactive)
    bringToFront();
}

coinsContainer.stage = stage;
coinsContainer.coins = coins;

export default rebind(coinsContainer, dispatch, 'on');