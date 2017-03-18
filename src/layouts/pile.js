import {randomNormal as d3_randomNormal} from 'd3-random';

export default {
  key: 'pile',
  value: 'Pile',
  requiredTypes: [],
  create: function pile(coins, properties, bounds) {
    var width = bounds.right - bounds.left,
        height = bounds.bottom - bounds.top;
    coins.forEach(function(coin, i) {
      var x = d3_randomNormal(bounds.left + width/2, width/10)();
      var y = d3_randomNormal(bounds.top + height/2, height/10)();
      coin.move(x, y);
    });
  }
}