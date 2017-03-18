import {Point, Matrix, Texture, utils, Sprite, autoDetectRenderer, Container, Rectangle} from 'pixi.js';
import {select as d3_select} from 'd3-selection';
import {event as d3_event} from 'd3-selection';
import {zoom as d3_zoom} from 'd3-zoom';
import coinsContainer from 'app/components/Coins';
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
      zoomBehavior = d3_zoom().scaleExtent([0.1, 1.2]).on("zoom", zoom),
      counter = 0,
      renderer = autoDetectRenderer(size.width, size.height, {transparent: true}),
      stage = new Container();

  stage.interactiveChildren = true;
  coinsContainer.parent(stage);

  function canvas(container) {
    container.appendChild(renderer.view);
    zoomCanvas = d3_select(renderer.view).call(zoomBehavior);

    coinsContainer
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

    stage.addChild(coinsContainer.stage);

    requestAnimationFrame(animate);
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

  function animate() {
    requestAnimationFrame(animate);
    renderer.render(stage);
  }

  function zoom() {
    stage.setTransform(d3_event.transform.x, d3_event.transform.y, d3_event.transform.k, d3_event.transform.k);
  }


  canvas.update = function() {
    var state = stateStore.get(),
        bounds = getCanvasBounds(),
        coins = coinsContainer.coins;

    renderer.resize(size.width, size.height);
    layouter.update(coins, state, bounds);
  }

  canvas.size = function(_) {
    if(!arguments.length) return size;
    size = _;
    return canvas;
  }

  return canvas;
}