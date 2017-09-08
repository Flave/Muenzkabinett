import {Point, autoDetectRenderer, Container} from 'pixi.js';
import {select as d3_select} from 'd3-selection';
import {dispatch as d3_dispatch} from 'd3-dispatch';
import rebind from 'utility/rebind';
import { getCoinsBounds, filterCoins } from 'utility';
import {event as d3_event} from 'd3-selection';
import {zoom as d3_zoom} from 'd3-zoom';
import {zoomTransform as d3_zoomTransform} from 'd3-zoom';
import {timer as d3_timer} from 'd3-timer';
import {easePolyInOut as d3_easePolyInOut} from 'd3-ease';
import coinsContainer from 'app/components/Coins';
import SelectionTool from 'app/components/SelectionTool';
import stateStore from 'app/stateStore';
import layouter from 'app/layouts';

export default function Canvas() {
  let size = {width: 200, height: 200};
  const renderer = autoDetectRenderer(size.width, size.height, {transparent: true});
  const stage = new Container();
  const dispatch = d3_dispatch('zoom', 'zoomstart', 'zoomend');
  const MIN_ZOOM = 0.1;
  const MAX_ZOOM = 1.2;
  const zoomBehavior = d3_zoom().scaleExtent([MIN_ZOOM, MAX_ZOOM])
    .on('zoom', handleZoom)
    .on('start', handleZoomStart)
    .on('end', handleZoomEnd);
  const selectionTool = SelectionTool()(stage).coins(coinsContainer.coins);
  let labelGroups = [];
  let zoomCanvas;
  let shouldUpdate = true; // used for to prevent updating after zooming

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
      console.log(event.clientX, event.clientY, projected);
    })

    requestAnimationFrame(animate);
    return canvas;
  }

  function getCanvasBounds() {
    const topLeft = projectPixel(0, 0);
    const bottomRight = projectPixel(size.width, size.height);
    const width = bottomRight.x - topLeft.x;
    const height = bottomRight.y - topLeft.y;

    return {
      left: topLeft.x,
      top: topLeft.y,
      right: bottomRight.x,
      bottom: bottomRight.y,
      cx: topLeft.x + width/2,
      cy: topLeft.y + height/2,
      width,
      height
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

  function handleZoomStart() {
    const {transform} = d3_event;
    dispatch.call('zoomstart', null, transform);
  }

  function handleZoom() {
    shouldUpdate = false;
    const {transform} = d3_event;
    dispatch.call('zoom', null, transform);

    if(transform)
      stage.setTransform(transform.x, transform.y, transform.k, transform.k);

    selectionTool
      .zoom(transform.k)
      .bounds(getCanvasBounds());
  }

  function handleZoomEnd() {
    const {transform} = d3_event;
    dispatch.call('zoomend', null, transform);
  }

  // function getNextBounds(nt) {
  //   let ot = d3_zoomTransform(zoomCanvas.node());
  //   nt = {...ot, ...nt};
    
  //   const left = nt.x - size.width/2 * (1/nt.k);
  //   const top = nt.y - size.height/2 * (1/nt.k);
  //   const right = nt.x + size.width/2 * (1/nt.k);
  //   const bottom = nt.y + size.height/2 * (1/nt.k);
    
  //   return {
  //     left,
  //     top,
  //     right,
  //     bottom
  //   }
  // }

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
      }
    }, 0);
  }

  function togglePan(doPan) {
    if(doPan)
      zoomCanvas.call(zoomBehavior);
    else
      zoomCanvas.call(zoomBehavior)
        .on('mousedown.zoom', null)
        .on('touchstart.zoom', null)
        .on('touchmove.zoom', null)
        .on('touchend.zoom', null);
  }

  function scaleToBounds(bounds, alignment) {
    const {width, height} = size;
    const dx = bounds.right - bounds.left;
    const dy = bounds.bottom - bounds.top;
    const PADDING = 0.1;
    let cx = bounds.left + dx/2;
    let cy = bounds.top + dy/2;
    let scale;

    if(alignment === 'top') {
      scale = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, (1 - PADDING) / (dx / width)));
      const canvasHeight = height / scale;
      const padding = canvasHeight * PADDING;
      if(bounds.bottom > canvasHeight - padding)
        cy = bounds.top + canvasHeight/2 - padding;
    } else {
      //const scaleY = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, 0.9 / dy / height));
      scale = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, (1 - PADDING) / Math.max(dx / width, dy / height)));
    }
    let scale2 = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, (1 - PADDING) / Math.max(dx / width, dy / height)));
    transformTo({k: scale, x: cx, y: cy});
  }

  function transformAfterUpdate({positions, bounds, alignment}) {
    let coinsBounds = bounds ? bounds : getCoinsBounds(positions);
    scaleToBounds(coinsBounds, alignment);
    stateStore.set({transitioning: true});
    window.setTimeout(() => stateStore.set({transitioning: false}), 1000);
  }

  function initializeCanvas() {
    const state = stateStore.get();
    const coins = coinsContainer.coins;
    const {selected} = filterCoins(coins, state.coinFilters, state.selectedCoins);

    // needed to initially center the canvas
    zoomBehavior.scaleTo(zoomCanvas, 1);
    zoomBehavior.translateTo(zoomCanvas, 0, 0);

    let transform = {k: .5, x: 0, y: 0};

    transformTo(transform, function() {
      const bounds = getCanvasBounds();      
      const layoutSpecs = layouter.update(selected, [], state, bounds);
      stateStore.set({canvasInitialized: true});
    });
  }

  canvas.update = function(doRelayout) {
    const state = stateStore.get();
    const coins = coinsContainer.coins;

    // prevent updating when zooming
    if(!shouldUpdate) {
      shouldUpdate = true;
      return; 
    }

    if(state.canvasInitialized === false)
      initializeCanvas();

    const {selected, notSelected} = filterCoins(coins, state.coinFilters, state.selectedCoins);

    coinsContainer.update(!state.selecting);
    selectionTool.update(state.selecting);
    togglePan(!state.selecting);
    renderer.resize(size.width, size.height);

    if(doRelayout && state.canvasInitialized === true) {
      let layoutSpecs = layouter.update(selected, notSelected, state, getCanvasBounds());
      labelGroups = layoutSpecs.labelGroups;

      transformAfterUpdate(layoutSpecs);
    }
  }

  canvas.labelGroups = function() {
    return labelGroups;
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