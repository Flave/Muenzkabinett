import {Point, Matrix, Texture, utils, Sprite, autoDetectRenderer, Container, Rectangle} from 'pixi.js';
import {select as d3_select} from 'd3-selection';
import {dispatch as d3_dispatch} from 'd3-dispatch';
import rebind from 'utility/rebind';
import { getCoinsBounds } from 'utility';
import {event as d3_event} from 'd3-selection';
import {zoom as d3_zoom} from 'd3-zoom';
import {zoomTransform as d3_zoomTransform} from 'd3-zoom';
import {timer as d3_timer} from 'd3-timer';
import {easePolyInOut as d3_easePolyInOut} from 'd3-ease';
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
      initialZoom = 1,
      zoomBehavior = d3_zoom().scaleExtent([0.1, 1.2]).on("zoom", handleZoom),
      selectionTool = SelectionTool()(stage).coins(coinsContainer.coins),
      labels = [],
      shouldUpdate = true; // used for to prevent updating after zooming

  stage.interactiveChildren = true;
  coinsContainer.parent(stage);

  function canvas(container) {
    //container.appendChild(renderer.view);
    container.insertBefore(renderer.view, container.firstChild);

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

    renderer.view.addEventListener('click', function(event) {
      var projected = projectPixel(event.clientX, event.clientY);
      //console.log(event.clientX, event.clientY, projected);
    })

    requestAnimationFrame(animate);
    return canvas;
  }

  function getCanvasBounds() {
    var topLeft = projectPixel(0, 0),
        bottomRight = projectPixel(size.width, size.height);
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


  function handleZoom() {
    shouldUpdate = false;
    dispatch.call('zoom');
    const {transform} = d3_event;

    if(transform)
      stage.setTransform(transform.x, transform.y, transform.k, transform.k);

    selectionTool
      .zoom(transform.k)
      .bounds(getCanvasBounds());
  }

  function getNextBounds(nt) {
    let ot = d3_zoomTransform(zoomCanvas.node());
    nt = {...ot, ...nt};
    return {
      left: nt.x - size.width/2 * (1/nt.k),
      top: nt.y - size.height/2 * (1/nt.k),
      right: nt.x + size.width/2 * (1/nt.k),
      bottom: nt.y + size.height/2 * (1/nt.k)
    }
  }

  function transformTo(nt, cb) {
    var ot, dk, dx, dy, duration;
    ot = d3_zoomTransform(zoomCanvas.node());
    ot.x = (size.width / 2 - ot.x) * (1/ot.k);
    ot.y = (size.height / 2 - ot.y) * (1/ot.k);
    nt = {...ot, ...nt};
    dk = nt.k - ot.k;
    dx = nt.x - ot.x;
    dy = nt.y - ot.y;
    duration = 1500;

    var timer = d3_timer(function(elapsed) {
      var t = elapsed / duration,
          k = ot.k + (dk * d3_easePolyInOut(t, 3)),
          x = ot.x + dx * d3_easePolyInOut(t, 3),
          y = ot.y + dy * d3_easePolyInOut(t, 3);

      zoomBehavior
        .scaleTo(zoomCanvas, k);
      zoomBehavior
        .translateTo(zoomCanvas, x, y);

      if(elapsed > duration) {
        timer.stop();
        cb && cb();
        let nt = d3_zoomTransform(zoomCanvas.node());
      }
    }, 0);
  }

  function scaleToBounds(bounds) {
      dx = bounds[1][0] - bounds[0][0],
      dy = bounds[1][1] - bounds[0][1],
      x = (bounds[0][0] + bounds[1][0]) / 2,
      y = (bounds[0][1] + bounds[1][1]) / 2,
      scale = Math.max(1, Math.min(8, 0.9 / Math.max(dx / width, dy / height))),
      translate = [width / 2 - scale * x, height / 2 - scale * y];

    svg.transition()
        .duration(750)
        .call(zoom.translate(translate).scale(scale).event);
  }

  function initializeCanvas() {
    var state = stateStore.get(),
        bounds,
        coins = coinsContainer.coins,
        selectedCoins = state.selectedCoins.length ? state.selectedCoins : coins;

    // needed to initially center the canvas
    zoomBehavior.scaleTo(zoomCanvas, 1);
    zoomBehavior.translateTo(zoomCanvas, 0, 0);

    let transform = {k: .5, x: 0, y: 0};

    transformTo(transform, function() {
      bounds = getCanvasBounds();      
      layouter.update(selectedCoins, [], state, bounds);
      stateStore.set({canvasInitialized: true});
    });
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

  function getNextScale() {
    let ot = d3_zoomTransform(zoomCanvas.node());
    if(ot.k > .4)
      return .4
    if(ot.k < .2)
      return .2
    return ot.k;
  }

  canvas.update = function(doRelayout) {
    var state = stateStore.get(),
        coins = coinsContainer.coins,
        selectedCoins = state.selectedCoins.length ? state.selectedCoins : coins,
        notSelectedCoins = [];

    // prevent updating when zooming
    if(!shouldUpdate) {
      shouldUpdate = true;
      return; 
    }

    if(state.canvasInitialized === false)
      initializeCanvas();

    coins.forEach(function(coin) {
      if(selectedCoins.indexOf(coin) === -1)
        notSelectedCoins.push(coin);
    });

    coinsContainer.update(!state.selecting);
    selectionTool.update(state.selecting);
    togglePan(!state.selecting);
    renderer.resize(size.width, size.height);

    if(doRelayout && state.canvasInitialized === true) {
      let nextScale = getNextScale();
      let coinsBounds = getCoinsBounds(coins);
      let bounds = getNextBounds({k: nextScale, x: coinsBounds.cx, y: coinsBounds.cy});
      transformTo({k: nextScale, x: coinsBounds.cx, y: coinsBounds.cy});
      labels = layouter.update(selectedCoins, notSelectedCoins, state, bounds).labels;
    }
  }

  canvas.labels = function() {
    return labels;
  }

  canvas.transform = function() {
    return d3_zoomTransform(zoomCanvas.node());
  }

  canvas.bounds = function() {
    return getCanvasBounds();
  }

  canvas.size = function(_) {
    if(!arguments.length) return size;
    size = _;
    return canvas;
  }

  return rebind(canvas, dispatch, 'on');
}