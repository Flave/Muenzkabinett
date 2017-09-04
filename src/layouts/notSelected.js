import {randomNormal as d3_randomNormal} from 'd3-random';
import _forEach from 'lodash/forEach';
import Victor from 'victor';

function mergeBounds(bounds1, bounds2) {
  return {
    top: bounds1.top < bounds2.top ? bounds1.top : bounds2.top,
    left: bounds1.left < bounds2.left ? bounds1.left : bounds2.left,
    bottom: bounds1.bottom > bounds2.bottom ? bounds1.bottom : bounds2.bottom,
    right: bounds1.right > bounds2.right ? bounds1.right : bounds2.right
  }
}

export default {
  create: function notSelected(coins, coinsBounds, canvasBounds) {
    const bounds = mergeBounds(coinsBounds, canvasBounds);
    const width = bounds.right - bounds.left;
    const height = bounds.bottom - bounds.top;
    const centerX = bounds.left + width/2;
    const centerY = bounds.top + height/2;
    const r = Math.sqrt(Math.pow(width/2, 2) + Math.pow(height/2, 2));
    const newCoinPositions = [];
    let x, y;

    coins.forEach(function(coin, i) {
        const delta = new Victor(coin.x - centerX, coin.y - centerY);
        const scatterOffset = Math.abs(d3_randomNormal(0, 200)());
        delta.normalize().multiply(new Victor(r + scatterOffset, r + scatterOffset))
        x = centerX + delta.x;
        y = centerY + delta.y;

      newCoinPositions.push({x: x, y: y});
      coin.move(x, y);
    });

    return newCoinPositions;
  }
}