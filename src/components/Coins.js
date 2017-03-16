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
    stage = new Container();

stage.interactiveChildren = true;

function updateCoinInfo() {
  var state = stateStore.get(),
      coins = coinsStore.get();

  if(state.selectedCoin !== undefined) {
    var coin = _find(coins, function(coin) {return coin.data.id === state.selectedCoin});
    //coinInfo.show(coin, stage.transform);
  } else {
    //coinInfo.hide();
  }
}


coinsContainer.add = function(coin) {
  coin.parentTransform(parent.transform.localTransform);
  stage.addChild(coin);

  coin
  .on('dragstart', function() {
    dispatch.call('dragstart');
  })
  .on('dragend', function() {
    dispatch.call('dragend');
  })
  .on('click', function() {
    dispatch.call('click');
    var state = stateStore.get();
    //coinInfo.hide();
    if(state.selectedCoin === this.data.id)
      stateStore.set('selectedCoin', undefined);
    else
      stateStore.set('selectedCoin', this.data.id);
  });
}

coinsContainer.parent = function(_) {
  if(!arguments.length) return parent;
  parent = _;
  return coinsContainer;
}

coinsContainer.stage = stage;
coinsContainer.coins = coins;

export default rebind(coinsContainer, dispatch, 'on');