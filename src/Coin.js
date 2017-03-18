import {Sprite, Point} from 'pixi.js';
import {dispatch as d3_dispatch} from 'd3-dispatch';
import {timer as d3_timer} from 'd3-timer';
import {easePolyInOut as d3_easePolyInOut} from 'd3-ease';
//import tooltip from 'app/components/Tooltip';
import stateStore from 'app/stateStore';
import rebind from 'utility/rebind';

export default function Coin(texture, data) {
  var coin = new PIXI.Sprite(texture),
      parentTransform,
      dispatch = d3_dispatch('dragstart', 'drag', 'dragend', 'click');

  coin.data = data;
  coin.interactive = true;
  coin.visible = true;

  coin
    .on('click', onClick)
    .on('mousedown', onDragStart)
    .on('touchstart', onDragStart)
    .on('mouseup', onDragEnd)
    .on('mouseupoutside', onDragEnd)
    .on('touchend', onDragEnd)
    .on('touchendoutside', onDragEnd)
    .on('mousemove', onDragMove)
    .on('touchmove', onDragMove)
    .on('mouseover', onMouseOver)
    .on('mouseout', onMouseOut);


  function onClick(event) {
    if(this.moved)
      return;
    dispatch.call('click', coin);
  }

  function onMouseOver(event) {
    var coinCenter = new Point(coin.position.x + coin.width/2, coin.position.y),
        projectedPoint = parentTransform.apply(coinCenter),
        state = stateStore.get(),
        tooltipData = {
          title: coin.data.title,
          date_earliest: coin.data.date_earliest,
          date_latest: coin.data.date_latest,
          selectedProperty: state.selectedProperties.length && {value: coin.data[state.selectedProperties[0].key], label: state.selectedProperties[0].value}
        }

/*    window.setTimeout(function() {
      tooltip.show(tooltipData, projectedPoint);
    });*/
    this.overCoin = true;
  }

  function onMouseOut(event) {
    //tooltip.hide();
    this.overCoin = false;
  }

  function onDragStart(event) {
    this.event = event.data;
    this.dragging = true;
    this.moved = null;

    var pos = new Point(this.position.x, this.position.y)
    var posProjected = parentTransform.apply(pos);

    var offsetX = event.data.originalEvent.clientX - posProjected.x,
        offsetY = event.data.originalEvent.clientY - posProjected.y;

    this.event.eventOffset = {x: offsetX, y: offsetY};
    dispatch.call('dragstart');
  }

  function onDragMove(event) {
    if (this.dragging) {
      var mouseX = this.event.originalEvent.clientX,
          mouseY = this.event.originalEvent.clientY,
          offsetX = this.event.eventOffset.x,
          offsetY = this.event.eventOffset.y,
          // transform is the PIXI container object the coin is contained in
          originalPoint = new Point(mouseX - offsetX, mouseY - offsetY),
          projectedPoint = parentTransform.applyInverse(originalPoint);
      // to check insie clickhandler whether coin has been moved
      this.moved = true;
      this.position.x = projectedPoint.x;
      this.position.y = projectedPoint.y;
      dispatch.call('drag');
    }

    if(this.overCoin)
      event.data.originalEvent.stopPropagation();
  }

  function onDragEnd() {
    // set the interaction data to null
    this.dragging = false;
    this.event = null;
    dispatch.call('dragend');
  }

  /*
    var x = properties.x !== undefined ? properties.x : coin.position.x,
        y = properties.y !== undefined ? properties.y : coin.position.y,
        scale = properties.scale !== undefined ? properties.scale : coin.scale,
        dx = x - coin.position.x,
        dy = y - coin.position.y,
        ds = scale - coin.scale,
        ox = coin.position.x,
        oy = coin.position.y,
        os = coin.scale;
  */

  coin.parentTransform = function(_) {
    if(!arguments.length) return parentTransform;
    parentTransform = _;
    return coin;
  }

  coin.move = function(x, y, duration, delay, cb) {
    var dx = x - coin.position.x,
        dy = y - coin.position.y,
        ox = coin.position.x,
        oy = coin.position.y;

    delay = delay || 0;
    duration = duration || 1000;

    var timer = d3_timer(function(elapsed) {
      var t = elapsed / duration;
      coin.position.x =  ox + (dx * d3_easePolyInOut(t, 3));
      coin.position.y =  oy + (dy * d3_easePolyInOut(t, 3));
      if(elapsed > duration) {
        timer.stop();
        cb !== undefined && cb(coin);
      }
    }, delay);
  }

  return rebind(coin, dispatch, 'on');
}