import {Sprite, Point} from 'pixi.js';
import {dispatch as d3_dispatch} from 'd3-dispatch';
import {timer as d3_timer} from 'd3-timer';
import {easePolyInOut as d3_easePolyInOut} from 'd3-ease';
import rebind from 'utility/rebind';

export default function Coin(texture, data) {
  const coin = new Sprite(texture);
  const dispatch = d3_dispatch('dragstart', 'drag', 'dragend', 'click', 'mouseenter', 'mouseleave');
  let parentTransform;

  coin.data = data;
  coin.interactive = true;

  coin.width = data.width;
  coin.height = data.height;

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


  function onClick() {
    if(this.moved)
      return;
    dispatch.call('click', coin, coin);
  }

  function onMouseOver() {
    dispatch.call('mouseenter', null, coin);
    this.overCoin = true;
  }

  function onMouseOut() {
    dispatch.call('mouseleave', null, coin);
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
    dispatch.call('dragstart', null, coin);
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
      // to check inside clickhandler whether coin has been moved
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
    dispatch.call('dragend', null, coin);
  }


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