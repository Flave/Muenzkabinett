import {randomNormal as d3_randomNormal} from 'd3-random';

export default {
  key: 'pile',
  value: 'Pile',
  requiredTypes: [],
  create: function pile(coins, properties, {cx, cy}) {
    const numCoins = coins.length;
    const positions = [];
    const spreadExponent = 0.2; // smaller number causes higher values for smaller coinNumbers relatively speaking
    const spreadFactor = 30; // scales spread in a linear fashion 
    let spread = Math.pow(numCoins, spreadExponent) * spreadFactor;

    coins.forEach(function(coin) {
      var x = d3_randomNormal(cx, spread)();
      var y = d3_randomNormal(cy, spread)();
      coin.move(x, y);
      positions.push({x: x, y:y});
    });
    return {
      positions
    };
  }
}