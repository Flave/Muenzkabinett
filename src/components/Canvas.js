import {Point, Matrix, Texture, utils, Sprite, autoDetectRenderer, Container, Rectangle} from 'pixi.js';
import {select as d3_select} from 'd3-selection';
import {dispatch as d3_dispatch} from 'd3-dispatch';
import rebind from 'utility/rebind';
import {event as d3_event} from 'd3-selection';
import {zoom as d3_zoom} from 'd3-zoom';
import {zoomTransform as d3_zoomTransform} from 'd3-zoom';
import {randomNormal as d3_randomNormal} from 'd3-random';
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
      initialZoom = 0.4,
      zoomBehavior = d3_zoom().scaleExtent([0.1, 1.2]).on("zoom", handleZoom),
      selectionTool = SelectionTool()(stage).coins(coinsContainer.coins),
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


  function handleZoom() {
    shouldUpdate = false;
    dispatch.call('zoom');

    if(d3_event.transform)
      stage.setTransform(d3_event.transform.x, d3_event.transform.y, d3_event.transform.k, d3_event.transform.k);

    selectionTool
      .zoom(d3_event.transform.k)
      .bounds(getCanvasBounds());
  }


  function zoomTo(s, cb) {
    var os = d3_zoomTransform(zoomCanvas.node()).k,
        ds = s - os,
        duration = 3000;

    var timer = d3_timer(function(elapsed) {
      var t = elapsed / duration,
          scale = os + (ds * d3_easePolyInOut(t, 3));
      zoomBehavior.scaleTo(zoomCanvas, scale);

      if(elapsed > duration) {
        timer.stop();
        cb && cb();
      }
    }, 0);
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


  function slowlyAddCoins(coins) {
    var numBatches = 10,
        batchCounter = 0,
        batchSize = Math.floor(coins.length/numBatches),
        batch = [];

    var interval = window.setInterval(() => {
      console.log('adding batch ' + batchCounter);
      batch = coins.slice(batchCounter * batchSize, (batchCounter + 1) * batchSize)
      batch.forEach((coin) => {
        coin.position.x = size.width / 2;
        coin.position.y = size.height;
        coinsContainer.stage.addChild(coin);
        //coin.move(Math.random() * 1000, Math.random() * 1000);
      });

      batchCounter++;
      if(batchCounter === numBatches)
        window.clearInterval(interval);
    }, 1000)
  }


  canvas.update = function(doRelayout) {
    var state = stateStore.get(),
        bounds = getCanvasBounds(),
        coins = coinsContainer.coins,
        selectedCoins = state.selectedCoins.length ? state.selectedCoins : coins,
        notSelectedCoins = [];

    // to prevent updating after zooming...maybe zoomlevel should be stored on state as well so it's easier to check if canvas should relayout?
    if(!shouldUpdate) {
      shouldUpdate = true;
      return; 
    }

    if(state.onboardingState === 0) {

      zoomTo(0.15, function() {
        bounds = getCanvasBounds();
        var width = bounds.right - bounds.left,
            height = bounds.bottom - bounds.top;
        selectedCoins.forEach(function(coin, i) {
          coin.visible = true;
          var x = d3_randomNormal(bounds.left + width/2, width/10)();
          var y = d3_randomNormal(bounds.top + height/2, height/10)();
          coin.move(x, y, 2000, Math.abs(d3_randomNormal(0, 200)()));
        });
        zoomTo(0.4);
        stateStore.set({onboardingState: 1});
      });
    }

    notSelectedCoins = coins.map(function(coin) {
      if(selectedCoins.indexOf(coin) === -1)
        notSelectedCoins.push(coin);
    });

    coinsContainer.update(!state.selecting);
    selectionTool.update(state.selecting);
    togglePan(!state.selecting);

    renderer.resize(size.width, size.height);
    if(doRelayout && state.onboardingState > 0)
      layouter.update(selectedCoins, notSelectedCoins, state, bounds);
  }

  canvas.size = function(_) {
    if(!arguments.length) return size;
    size = _;
    return canvas;
  }

  return rebind(canvas, dispatch, 'on');
}