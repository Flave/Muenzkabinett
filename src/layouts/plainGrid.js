import {getPaddedDimensions, getExtent} from 'utility';
import {scaleLinear as d3_scaleLinear} from 'd3-scale';
import {COIN_HEIGHT} from 'constants';

export default {
  key: 'plain_grid',
  value: 'Plain Grid',
  requiredTypes: ['continuous'],
  create: function plainGrid(coins, properties, bounds) {
    const paddingRatio = 0.05;
    const property = properties[0];
    const key = property.key;
    const extentX = getExtent(coins, key);
    const paddedDimensions = getPaddedDimensions(bounds, {left: 200, right: paddingRatio, top: paddingRatio, bottom: paddingRatio});
    const value2X = d3_scaleLinear().domain(extentX).range([0, 1]);
    const ticks = value2X.nice().ticks();
    const positions = [];
    const labelGroups = [{key: property.key, labels: []}];
    let labelIndex = 0;
    let x = paddedDimensions.left;
    let yIndex = 0;
    let y = 0;
    coins.sort(function(a, b) {
      return a.data[key] - b.data[key];
    });

    coins.forEach(function(coin) {
      if(x > paddedDimensions.right) {
        x = paddedDimensions.left;
        yIndex++;
      }
      y = yIndex * COIN_HEIGHT + paddedDimensions.top;

      coin.move(x, y);
      positions.push({x, y});
      x += coin.width;

      const tick = ticks[labelIndex];

      if(coin.data[key] >= tick) {
        labelGroups[0].labels.push({
          value: tick,
          key,
          x: paddedDimensions.left - 50,
          y,
          minZoom: labelIndex % 2 === 0 ? .2 : .3,
          alignment: 'right'
        });

        labelIndex++;
      }
    });

    return {positions, labelGroups};
  }
}