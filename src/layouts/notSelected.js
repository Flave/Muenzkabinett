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
  create: function pile(coins, coinsBounds, canvasBounds) {
/*    var width = canvasBounds.right - canvasBounds.left,
        height = canvasBounds.bottom - canvasBounds.top,
        centerX = canvasBounds.left + width/2,
        centerY = canvasBounds.top + height/2,
        r = Math.sqrt(Math.pow(width/2, 2) + Math.pow(height/2, 2)),
        newCoinPositions = [];

      coins.forEach(function(coin, i) {
        const a = Math.random() * Math.PI * 2;
        const x = centerX + Math.cos(a) * (r + Math.abs(d3_randomNormal(0, 200)()));
        const y = centerY + Math.sin(a) * (r + Math.abs(d3_randomNormal(0, 200)()));
        newCoinPositions.push({x, y});
        coin.move(x, y);
      })*/

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