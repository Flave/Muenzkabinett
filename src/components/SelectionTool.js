import {Point, Container, Graphics, Rectangle, Polygon} from 'pixi.js';
import rebind from 'utility/rebind';
import {dispatch as d3_dispatch} from 'd3-dispatch';
import stateStore from 'app/stateStore';


export default function SelectionTool() {
  var polygonsData = [],
      currentPolygonData = [],
      graphics = new Graphics(),
      container = new Container(),
      dispatch = d3_dispatch('selection', 'selectionend'),
      bounds = {top: 0, left: 0, right: 1, bottom: 1},
      parentContainer,
      coins,
      active = false,
      recording = false;

  container.hitArea = new Rectangle(0, 0, 1, 1);
  container.interactive = true;
  setBackgroundSize();
  container.addChild(graphics);

  function selectionTool(_parentContainer) {
    parentContainer = _parentContainer;
    reset();
    return selectionTool;
  }

  function projectPixel(x, y) {
    var mousePos = new Point(x, y);
    return parentContainer.transform.localTransform.applyInverse(mousePos);
  }

  function reset() {
    polygonsData = [];
    graphics.clear();
    setLineStyle();
  }

  function setLineStyle() {
    graphics.lineStyle(2, 0xffd900, 1);
  }

  function startRecording(event) {
    console.log('start recording');
    if(recording) return;
    var position = projectPixel(event.data.global.x, event.data.global.y);
    setLineStyle();
    graphics.moveTo(position.x, position.y);
    currentPolygonData.push(position);
    recording = true;
  }

  function record(event) {
    if(!recording) return;
    var position = projectPixel(event.data.global.x, event.data.global.y);
    setLineStyle();
    graphics.lineTo(position.x, position.y);
    currentPolygonData.push(position);
  }

  function onMouseUp(event) {
    if(!recording) return;
    recording = false;
    setLineStyle();
    graphics.lineTo(currentPolygonData[0].x, currentPolygonData[0].y);
    polygonsData.push(currentPolygonData);
    currentPolygonData = [];
    dispatch.call('selection');

    if(!event.data.originalEvent.shiftKey)
      stopRecording();
  }

  function onKeyUp(event) {
    if(event.key === 'Shift')
      stopRecording();
  }

  function stopRecording() {
    var selectedCoins = getSelection();
    reset();
    if(!selectedCoins.length) return;
    stateStore.set({'selectedCoins': selectedCoins});
    dispatch.call('selectionend');
  }

  function setBackgroundSize() {
    container.hitArea.x = bounds.left;
    container.hitArea.y = bounds.top;
    container.hitArea.width = bounds.right - bounds.left;
    container.hitArea.height = bounds.bottom - bounds.top
  }

  function getSelection() {
    var polygon,
        selectedCoins = [];

    polygonsData.forEach((polygonData) => {
      polygon = new Polygon(polygonData);
      coins.forEach((coin, i) => {
        if(selectedCoins.indexOf(coin) === -1 && polygon.contains(coin.x, coin.y))
          selectedCoins.push(coin);
      });
    });
    console.log(selectedCoins.length);
    return selectedCoins;
  }

  function toggleActivity() {
    if(active) {
      container.mousedown = startRecording;
      container.mousemove = record;
      container.mouseup = onMouseUp;
      document.addEventListener('keyup', onKeyUp);
    } else {
      container.mousedown = null;
      container.mousemove = null;
      container.mouseup = null;
      document.removeEventListener('keyup', onKeyUp);
    }
  }

  function bringToFront() {
    parentContainer.removeChild(container);
    parentContainer.addChild(container);
  }

  selectionTool.coins = function(_) {
    if(!arguments.length) return coins;
    coins = _;
    return selectionTool;
  }

  selectionTool.update = function(startSelecting) {
    if(active && startSelecting) return;
    active = startSelecting;

    toggleActivity();
    if(active)
      bringToFront();
  }

  selectionTool.bounds = function(_) {
    if(!arguments.length) return bounds;
    bounds = _;
    setBackgroundSize();
    return selectionTool;
  }

  return rebind(selectionTool, dispatch, 'on');
}