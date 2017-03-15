import {Point, Matrix, Texture, utils, Sprite, autoDetectRenderer, Container, Rectangle} from 'pixi.js';
import {select as d3_select} from 'd3-selection';
import {event as d3_event} from 'd3-selection';
import {zoom as d3_zoom} from 'd3-zoom';
import coinsStore from 'app/coinsStore';
import stateStore from 'app/stateStore';
import layouter from 'app/layouts';
import pile from 'app/layouts/pile';
//import coinInfo from 'app/components/CoinInfo';
import _find from 'lodash/find';

export default function Canvas() {
  var renderer,
      stage,
      coins = [],
      zoomCanvas,
      size = {width: 200, height: 200},
      initialized = false,
      zoomBehavior = d3_zoom().scaleExtent([0.1, 1.2]).on("zoom", zoom).on('end', zoomEnd),
      counter = 0;

  function canvas(container) {
    renderer = autoDetectRenderer(size.width, size.height, {transparent: true});
    container.appendChild(renderer.view);
    stage = new Container();
    stage.interactiveChildren = true;
    zoomCanvas = d3_select(renderer.view).call(zoomBehavior);
    renderer.render(stage);
    return canvas;
  }

  function getCanvasBounds() {
    var topLeft = projectPixel(0, 0),
        bottomRight = projectPixel(window.innerWidth, window.innerHeight);
    return {
      left: topLeft.x,
      top: topLeft.y,
      right: bottomRight.x,
      bottom: bottomRight.y
    }
  }

  function projectPixel(x, y) {
    var mousePos = new Point(x, y);
    return stage.transform.localTransform.applyInverse(mousePos);
  }

  function initialize() {
    coinsStore.get().forEach(function(coin, i) {
      coin
      .on('dragstart', function() {
        zoomCanvas.on('.zoom', null);
      })
      .on('dragend', function() {
        zoomCanvas.call(zoomBehavior);
      })
      .on('click', function() {
        var state = stateStore.get();
        //coinInfo.hide();
        if(state.selectedCoin === this.data.id)
          stateStore.set('selectedCoin', undefined);
        else
          stateStore.set('selectedCoin', this.data.id);
      });

      stage.addChild(coin);
    });

    stateStore.on('change.canvas', update);

    requestAnimationFrame( animate );
    initialized = true;
  }

  function animate() {
    requestAnimationFrame(animate);
    renderer.render(stage);
  }

  function zoom() {
    stage.setTransform(d3_event.transform.x, d3_event.transform.y, d3_event.transform.k, d3_event.transform.k);
    renderer.render(stage);
    updateCoinInfo();
  }

  function zoomEnd() {

  }

  function update() {

  }

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

  canvas.update = function() {
    var state = stateStore.get(),
        bounds = getCanvasBounds(),
        coins = coinsStore.get();

    if(!initialized) {
      initialize();
    }

    renderer.resize(size.width, size.height);

    layouter.update(coins, state, bounds);
/*    window.setTimeout(function() {
      updateCoinInfo();
    }, 1200);*/
  }

  canvas.coins = function(_) {
    if(!arguments.length) return coins;
    coins = _;
    return canvas;
  }

  canvas.size = function(_) {
    if(!arguments.length) return size;
    size = _;
    return canvas;
  }

  return canvas;
}