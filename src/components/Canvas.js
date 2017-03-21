import {Point, Matrix, Texture, utils, Sprite, autoDetectRenderer, Container, Rectangle} from 'pixi.js';
import {select as d3_select} from 'd3-selection';
import {dispatch as d3_dispatch} from 'd3-dispatch';
import rebind from 'utility/rebind';
import {event as d3_event} from 'd3-selection';
import {zoom as d3_zoom} from 'd3-zoom';
import coinsContainer from 'app/components/Coins';
import SelectionTool from 'app/components/SelectionTool';
import stateStore from 'app/stateStore';
import layouter from 'app/layouts';
//import coinInfo from 'app/components/CoinInfo';
import _find from 'lodash/find';

export default function Canvas() {
  var size = {width: 200, height: 200},
      renderer = autoDetectRenderer(size.width, size.height, {transparent: true}),
      stage = new Container(),
      dispatch = d3_dispatch('zoom'),
      zoomCanvas,
      zoomBehavior = d3_zoom().scaleExtent([0.1, 1.2]).on("zoom", zoom),
      selectionTool = SelectionTool()(stage).on('selection', handleSelection).coins(coinsContainer.coins),
      shouldUpdate = true; // used for to prevent updating after zooming

  stage.interactiveChildren = true;
  coinsContainer.parent(stage);

  function canvas(container) {
    container.appendChild(renderer.view);
    zoomCanvas = d3_select(renderer.view);

    selectionTool
      .bounds(getCanvasBounds())
      .update();

    coinsContainer
      .on('dragstart', function() {
        zoomCanvas.on('.zoom', null);
      })
      .on('dragend', function() {
        zoomCanvas.call(zoomBehavior);
      });

    requestAnimationFrame(animate);
    return canvas;
  }

  function handleSelection() {
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
    shouldUpdate = false;
    dispatch.call('zoom');

    if(d3_event.transform)
      stage.setTransform(d3_event.transform.x, d3_event.transform.y, d3_event.transform.k, d3_event.transform.k);

    selectionTool
      .zoom(d3_event.transform.k)
      .bounds(getCanvasBounds());
  }

  function togglePan(doPan) {
    if(doPan)
      zoomCanvas.call(zoomBehavior);
    else
      zoomCanvas.call(zoomBehavior)
        .on("mousedown.zoom", null)
        .on("touchstart.zoom", null)
        .on("touchmove.zoom", null)
        .on("touchend.zoom", null);
  }

  canvas.update = function(doRelayout) {
    // to prevent updating after zooming...maybe zoomlevel should be stored on state as well so it's easier to check if canvas should relayout?
    if(!shouldUpdate) {
      shouldUpdate = true;
      return; 
    }

    var state = stateStore.get(),
        bounds = getCanvasBounds(),
        coins = coinsContainer.coins,
        selectedCoins = state.selectedCoins.length ? state.selectedCoins : coins,
        notSelectedCoins = [];

    notSelectedCoins = coins.map(function(coin) {
      if(selectedCoins.indexOf(coin) === -1)
        notSelectedCoins.push(coin);
    });

    coinsContainer.update(!state.selecting);
    selectionTool.update(state.selecting);
    togglePan(!state.selecting);

    renderer.resize(size.width, size.height);
    if(doRelayout)
      layouter.update(selectedCoins, notSelectedCoins, state, bounds);
  }

  canvas.size = function(_) {
    if(!arguments.length) return size;
    size = _;
    return canvas;
  }

  return rebind(canvas, dispatch, 'on');
}