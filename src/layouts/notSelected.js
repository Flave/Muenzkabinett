import {randomNormal as d3_randomNormal} from 'd3-random';
import _forEach from 'lodash/forEach';
import Victor from 'victor';
import {COIN_HEIGHT} from 'constants';

function mergeBounds(bounds1, bounds2) {  
  const top = bounds1.top < bounds2.top ? bounds1.top : bounds2.top;
  const left = bounds1.left < bounds2.left ? bounds1.left : bounds2.left;
  const bottom = bounds1.bottom > bounds2.bottom ? bounds1.bottom : bounds2.bottom;
  const right = bounds1.right > bounds2.right ? bounds1.right : bounds2.right;
  return {
    top: top - 500 - COIN_HEIGHT,
    left: left - 500 - COIN_HEIGHT,
    bottom: bottom + 500,
    right: right + 500
  }
}

export default {
  create: function notSelected(coins, coinsBounds, canvasBounds, selectedCoin) {
    const bounds = mergeBounds(coinsBounds, canvasBounds);
    const width = bounds.right - bounds.left;
    const height = bounds.bottom - bounds.top;
    const centerX = bounds.left + width/2;
    const centerY = bounds.top + height/2;
    const r = Math.sqrt(Math.pow(width/2, 2) + Math.pow(height/2, 2));
    const newCoinPositions = [];
    let x, y;

    coins.forEach(function(coin, i) {
      // if there is a coin selected, just ignore it
      if(selectedCoin && selectedCoin.data.id === coin.data.id) return;

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