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
import stateStore from 'app/stateStore';
import layouter from 'app/layouts';

export default function Canvas() {
  let size = {width: 200, height: 200};
  const renderer = autoDetectRenderer(size.width, size.height, {transparent: true});
  const stage = new Container();
  const dispatch = d3_dispatch('zoom', 'zoomstart', 'zoomend', 'initialized');
  const MIN_ZOOM = 0.1;
  const MAX_ZOOM = 1.2;
  const zoomBehavior = d3_zoom().scaleExtent([MIN_ZOOM, MAX_ZOOM])
    .on('zoom', handleZoom)
    .on('start', handleZoomStart)
    .on('end', handleZoomEnd);
  let labelGroups = [];
  let zoomCanvas;
  let stopAnimationTimeout;
  let transitionTimer;
  let animating = true; // set to false if no rerender required anymore
  let transitioning = false; // Needed to prevent zoomEnd handler from stopping animation

  stage.interactiveChildren = true;
  coinsContainer.parent(stage);

  function canvas(container) {
    //container.appendChild(renderer.view);
    container.insertBefore(renderer.view, container.firstChild);

    zoomCanvas = d3_select(renderer.view);

    coinsContainer
      .on('dragstart', function() {
        zoomCanvas.on('.zoom', null);
      })
      .on('dragend', function() {
        zoomCanvas.call(zoomBehavior);
      });

    zoomCanvas.call(zoomBehavior);

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
    if(animating)
      renderer.render(stage);
    requestAnimationFrame(animate);
  }

  function startAnimation(source) {
    // clear timeout if one is set so it doesn't interfere with current animation
    clearTimeout(stopAnimationTimeout);
    animating = true;
  }

  function stopAnimation(source) {
    animating = false;
  }

  function handleZoomStart() {
    if(!transitioning)
      startAnimation();
    const {transform} = d3_event;
    dispatch.call('zoomstart', null, transform);
  }

  function handleZoom() {
    const {transform} = d3_event;
    dispatch.call('zoom', null, transform);

    if(transform)
      stage.setTransform(transform.x, transform.y, transform.k, transform.k);
  }

  function handleZoomEnd() {
    if(!transitioning)
      stopAnimation();
    const {transform} = d3_event;
    dispatch.call('zoomend', null, transform);
  }

  function transformTo(nt) {
    const ot = d3_zoomTransform(zoomCanvas.node());
    ot.x = (size.width / 2 - ot.x) * (1/ot.k);
    ot.y = (size.height / 2 - ot.y) * (1/ot.k);
    nt = {...ot, ...nt};
    const dk = nt.k - ot.k;
    const dx = nt.x - ot.x;
    const dy = nt.y - ot.y;
    const duration = 1500;
    transitioning = true;
    transitionTimer && transitionTimer.stop();

    startAnimation();

    transitionTimer = d3_timer(function(elapsed) {
      var t = elapsed / duration,
        k = ot.k + (dk * d3_easePolyInOut(t, 3)),
        x = ot.x + dx * d3_easePolyInOut(t, 3),
        y = ot.y + dy * d3_easePolyInOut(t, 3);

      zoomBehavior.scaleTo(zoomCanvas, k);
      zoomBehavior.translateTo(zoomCanvas, x, y);

      if(elapsed > duration) {
        transitionTimer.stop();
        transitioning = false;
      }
    }, 0);

    // generous and lazy way to stop animating after update
    stopAnimationTimeout = setTimeout(stopAnimation, 3000);
  }

  function getNextBounds(nt) {
    let ot = d3_zoomTransform(zoomCanvas.node());
    nt = {...ot, ...nt};
    
    const left = nt.x - size.width/2 * (1/nt.k);
    const top = nt.y - size.height/2 * (1/nt.k);
    const right = nt.x + size.width/2 * (1/nt.k);
    const bottom = nt.y + size.height/2 * (1/nt.k);
    const height = bottom - top;
    const width = right - left;
    
    return {
      left,
      top,
      right,
      bottom,
      height,
      width
    }
  }


  function scaleToBounds(bounds, alignment) {
    const {width, height} = size;
    const dx = bounds.right - bounds.left;
    const dy = bounds.bottom - bounds.top;
    const PADDING = 0.1;
    let cx = bounds.left + dx/2;
    let cy = bounds.top + dy/2;
    let scale = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, (1 - PADDING) / Math.max(dx / width, dy / height)));
    alignment = alignment ? alignment : [];

    if(alignment[1] === 'top') {
      scale = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, (1 - PADDING) / (dx / width)));
      const nextBounds = getNextBounds({k: scale, x: cx, y: cy});
      const padding = nextBounds.height * PADDING;
      if(bounds.bottom > nextBounds.bottom - padding) {
        cy = bounds.top + nextBounds.height/2 - padding;
      }
    } 
    if(alignment[0] === 'left') {
      scale = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, (1 - PADDING) / (dy / height)));
      const nextBounds = getNextBounds({k: scale, x: cx, y: cy});
      const padding = nextBounds.width * PADDING;
      if(bounds.right > nextBounds.right - padding) {
        cx = bounds.left + nextBounds.width/2 - padding;
      }      
    }
    transformTo({k: scale, x: cx, y: cy});
  }

  function transformAfterUpdate({bounds, alignment}) {
    scaleToBounds(bounds, alignment);
    stateStore.set({transitioning: true, hoveredCoin: undefined});
    window.setTimeout(() => stateStore.set({transitioning: false}), 1000);
  }

  canvas.initialize = (space) => {
    renderer.resize(size.width, size.height);
    // needed to initially center the canvas
    zoomBehavior.scaleTo(zoomCanvas, 1);
    zoomBehavior.translateTo(zoomCanvas, 0, 0);

    const {positions} = layouter.intro(coinsContainer.coins, getCanvasBounds());
    transformTo({k: .5, x: 0, y: 0});
    window.setTimeout(function() {
      // dispatch initializd to start loading high res images
      dispatch.call('initialized');
    }, 2000);
  }

  canvas.frame = () => {
    renderer.render(stage);
  }

  canvas.update = function(space) {
    const state = stateStore.get();
    const coins = coinsContainer.coins;

    renderer.resize(size.width, size.height);
    const {selected, notSelected} = filterCoins(coins, state.coinFilters, state.selectedCoins);
    const layoutSpecs = layouter.update(selected, notSelected, state, getCanvasBounds());
    labelGroups = layoutSpecs.labelGroups;
    // if layout didn't define bounds the bounds will simply be all the selected coins
    layoutSpecs.bounds = layoutSpecs.bounds ? layoutSpecs.bounds : getCoinsBounds(layoutSpecs.positions);
    transformAfterUpdate(layoutSpecs);
    layouter.updateNotSelected(notSelected, layoutSpecs.bounds, getCanvasBounds(), state);
  }

  // returns the labels that were returned by the current layout
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