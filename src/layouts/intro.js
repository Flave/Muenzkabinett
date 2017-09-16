import {randomNormal as d3_randomNormal} from 'd3-random';
import Victor from 'victor';

export default {
  key: 'intro',
  value: 'Intro',
  requiredTypes: [],
  create: function(coins, {cx, cy, width, height}) {
    const numCoins = coins.length;
    const positions = [];
    const size = Math.max(width, height);

    coins.forEach(function(coin, i) {
      let a = Math.random() * Math.PI * 2;
      let r = size + size * Math.abs(d3_randomNormal(0, 1)());
      let x = Math.sin(a) * r;
      let y = Math.cos(a) * r;
      coin.position.x = x;
      coin.position.y = y;
      coin.visible = true;
      r = size * .85 + d3_randomNormal(300, size * .17)();
      x = Math.sin(a) * r;
      y = Math.cos(a) * r;
      coin.move(x, y, 2000, Math.random() * 500);
      positions.push({x, y});
    });
    return {
      positions
    };
  }
}