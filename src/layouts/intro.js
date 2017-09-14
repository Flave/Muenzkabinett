import {randomNormal as d3_randomNormal} from 'd3-random';

// function getRectPosition({cx, cy, width, height}) {
//   const total = width * 2 + height * 2;
//   const pos = Math.random() * total;
//   let offset = 0;
//   let prevOffset = 0;
//   let x, y;

//   for(let i=0; i<4; i++) {
//     let currentSide = i%2 === 0 ? height : width;
//     let sideSign = i < 2 ? 1 : -1;
//     prevOffset = offset;
//     offset += currentSide;
//     if(pos >= prevOffset && pos < offset) {
//       const sideOffset = (pos - prevOffset) - currentSide/2;
//       x = i % 2 === 0 ? cx + (width/2 * sideSign) : (cx + sideOffset);
//       y = i % 2 === 0 ? (cy + sideOffset) : cy + (height/2 * sideSign);
//       break;
//     }
//   }
//   return {x, y};
// }

export default {
  key: 'pile',
  value: 'Pile',
  requiredTypes: [],
  create: function pile(coins, {cx, cy, width, height}, space) {
    const numCoins = coins.length;
    const positions = [];
    const spreadExponent = 0.2; // smaller number causes higher values for smaller coinNumbers relatively speaking
    const spreadFactor = 30; // scales spread in a linear fashion 
    let spread = Math.pow(numCoins, spreadExponent) * spreadFactor;
    const startR = Math.max(width, height);
    const r = Math.max(space.width, space.height);

    coins.forEach(function(coin, i) {
      let a = Math.random() * Math.PI * 2;
      let x = Math.sin(a) * startR * d3_randomNormal(3, 1)() + cx;
      let y = Math.cos(a) * startR * d3_randomNormal(3, 1)() + cy;
      coin.position.x = x;
      coin.position.y = y;
      coin.visible = true;
      x = d3_randomNormal(cx, spread)();
      y = d3_randomNormal(cy, spread)();
      coin.move(pos.x, pos.y, 2000, Math.random() * 500);
      positions.push({x: pos.x, y: pos.y});
    });
    return {
      positions
    };
  }
}