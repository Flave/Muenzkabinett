import {randomNormal as d3_randomNormal} from 'd3-random';
import {getCanvasArea} from 'utility';

export default {
  key: 'pile',
  value: 'Pile',
  requiredTypes: [],
  create: function pile(coins, properties, bounds) {
    const {width, height} = getCanvasArea(bounds);
    const numCoins = coins.length;
    const positions = [];
    const spreadFactor = 0.7;
    const maxSpread = 400;
    let spread = Math.pow(numCoins, spreadFactor);
    spread = Math.min(spread, maxSpread)

    coins.forEach(function(coin) {
      var x = d3_randomNormal(bounds.left + width/2, spread)();
      var y = d3_randomNormal(bounds.top + height/2, spread)();
      coin.move(x, y);
      positions.push({x: x, y:y});
    });
    return {
      positions,
      zoom: 'bounds'
    };
  }
}