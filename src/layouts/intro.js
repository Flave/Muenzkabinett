import {randomNormal as d3_randomNormal} from 'd3-random';

export default {
  key: 'pile',
  value: 'Pile',
  requiredTypes: [],
  create: function pile(coins, {cx, cy, width, height}) {
    const numCoins = coins.length;
    const positions = [];
    const spreadExponent = 0.2; // smaller number causes higher values for smaller coinNumbers relatively speaking
    const spreadFactor = 80; // scales spread in a linear fashion 
    let spread = Math.pow(numCoins, spreadExponent) * spreadFactor;
    const startR = Math.max(width, height);

    coins.forEach(function(coin, i) {
      let a = Math.random() * Math.PI * 2;
      let x = Math.sin(a) * startR * d3_randomNormal(3, 1)();
      let y = Math.cos(a) * startR * d3_randomNormal(3, 1)();
      coin.position.x = x;
      coin.position.y = y;
      coin.visible = true;
      x = d3_randomNormal(0, spread)();
      y = d3_randomNormal(0, spread)();
      coin.move(x, y, 2000, Math.random() * 500);
      positions.push({x, y});
    });
    return {
      positions
    };
  }
}