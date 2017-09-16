import {getExtent, getCoinsBounds} from 'utility';
import {scaleLinear as d3_scaleLinear} from 'd3-scale';
import {COIN_HEIGHT} from 'constants';

export default {
  key: 'plain_grid',
  value: 'Plain Grid',
  requiredTypes: ['continuous'],
  create: function plainGrid(coins, properties, bounds) {
    const MAX_WIDTH = 4000;
    const MARGIN_LEFT = 100; // margin for labels
    const maxRight = bounds.left + MAX_WIDTH;
    const startX = bounds.left + MARGIN_LEFT;
    const property = properties[0];
    const key = property.key;
    const extentX = getExtent(coins, key);
    const value2X = d3_scaleLinear().domain(extentX).range([0, 1]);
    const ticks = value2X.nice().ticks();
    const positions = [];
    const labelGroups = [{key: property.key, labels: []}];
    let labelIndex = 0;
    let x = startX;
    let yIndex = 0;
    let y = 0;
    coins.sort(function(a, b) {
      return a.data[key] - b.data[key];
    });

    coins.forEach(function(coin) {
      if(x > maxRight) {
        x = startX;
        yIndex++;
      }
      y = yIndex * COIN_HEIGHT + bounds.top;

      coin.move(x, y);
      positions.push({x, y});
      x += coin.width;

      const tick = ticks[labelIndex];

      if(coin.data[key] >= tick) {
        labelGroups[0].labels.push({
          value: tick,
          key,
          x: bounds.left,
          y,
          minZoom: labelIndex % 2 === 0 ? .2 : .3,
          alignment: ['right', 'top'],
          sticky: ['left', 'center']
        });

        labelIndex++;
      }
    });
    const newBounds = getCoinsBounds(positions);
    newBounds.left -= MARGIN_LEFT;
    return {positions, labelGroups, bounds: newBounds, alignment: ['', 'top']};
  }
}