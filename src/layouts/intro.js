import {randomNormal as d3_randomNormal} from 'd3-random';

export default {
  key: 'intro',
  value: 'Intro',
  requiredTypes: ['intro'],
  create: function pile(coins, state, bounds) {
    var width = bounds.right - bounds.left,
        height = bounds.bottom - bounds.top;

    coins.forEach((coin, i) => {
      var x = d3_randomNormal(bounds.left + width/2, width/10)();
      var y = d3_randomNormal(bounds.top + height/2, height/10)();
      coin.visible = true;
      coin.position.x = x;
      coin.position.y = y;
      coin.move(x, y);
    });
  }
}