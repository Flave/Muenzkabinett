import {randomNormal as d3_randomNormal} from 'd3-random';

export default {
  key: 'intro',
  value: 'Intro',
  requiredTypes: ['intro'],
  create: function pile(coins, bounds) {
    const width = bounds.right - bounds.left;
    const height = bounds.bottom - bounds.top;


    coins.forEach((coin) => {
      const x = d3_randomNormal(bounds.left + width/2, width/10)();
      const y = bounds.top + height/2;
      coin.position.x = bounds.left + width/2;
      coin.position.y = 5000;

      coin.move(x, y, 1000, Math.random() * 600 + 300);
    });
  }
}