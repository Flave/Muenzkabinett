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
    const spreadExponent = 0.2; // smaller number causes higher values for smaller coinNumbers relatively speaking
    const spreadFactor = 30; // scales spread in a linear fashion 
    let spread = Math.pow(numCoins, spreadExponent) * spreadFactor;

    coins.forEach(function(coin) {
      var x = d3_randomNormal(bounds.left + width/2, spread)();
      var y = d3_randomNormal(bounds.top + height/2, spread)();
      coin.move(x, y);
      positions.push({x: x, y:y});
    });
    return {
      positions
    };
  }
}