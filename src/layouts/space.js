import {randomNormal as d3_randomNormal} from 'd3-random';
import Victor from 'victor';

function getRectPosition(bounds) {
  const offset = Math.random();
  const total = bounds.width * 2 + bounds.height * 2;
}

export default {
  key: 'space',
  value: 'Space',
  requiredTypes: ['space'],
  create: function pile(coins, {cx, cy, width, height}, space) {
    const r = Math.max(width, height) / 2;

    coins.forEach((coin) => {
      let x = Math.sin(Math.random() * Math.PI) * (r + 40) + cx;
      let y = Math.sin(Math.random() * Math.PI) * (r + 40) + cy;
      coin.position.x = x;
      coin.position.y = y;
      x = d3_randomNormal(0, 200)() + cx;
      y = d3_randomNormal(0, 200)() + cy;
      coin.move(x, y, 1000, Math.random() * 600 + 300);
    });
  }
}