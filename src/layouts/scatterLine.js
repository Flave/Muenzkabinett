import {randomNormal as d3_randomNormal} from 'd3-random';
import {scaleLinear as d3_scaleLinear} from 'd3-scale';
import {groupContinuous, getExtent} from 'app/utility';

export default {
  key: 'scatter_line',
  value: 'Scatter Line',
  requiredTypes: ['continuous'],
  create: function plainGrid(coins, properties, {cy, cx}, options={}) {
    const property = properties[0];
    const domain = options.domain || getExtent(coins, property.key);
    const groups = groupContinuous(coins, property, domain);
    const spacingX = 200;
    const rangeDelta = groups.length * spacingX;
    const range = [cx - rangeDelta/2, cx + rangeDelta/2];
    const value2X = d3_scaleLinear().domain(domain).range(range);
    const ticks = value2X.nice().ticks();
    const yPositionExtent = [Infinity, -Infinity];
    const positions = [];
    const labelGroups = [{key: property.key}];
    const ySpreadExponent = 0.3; // smaller number causes higher values for smaller coinNumbers relatively speaking
    const ySpreadFactor = options.ySpreadFactor ? options.ySpreadFactor : 20; // scales spread in a linear fashion 

    groups.forEach(function(group) {
      group.forEach(function(coin) {
        const spreadY = Math.pow(group.length, ySpreadExponent) * ySpreadFactor;
        const xOffset = value2X(coin.data[property.key]) - coin.width/2 + d3_randomNormal(0, 40)();
        const x = xOffset;
        const y = cy + d3_randomNormal(0, spreadY)();

        positions.push({x, y});
        coin.move(x, y);
        yPositionExtent[0] = yPositionExtent[0] < y ? yPositionExtent[0] : y;
        yPositionExtent[1] = yPositionExtent[1] > y ? yPositionExtent[1] : y;
      });
    });

    labelGroups[0].labels = ticks.map(tick => {
      return {
        value: tick,
        y: options.labelsPos === 'top' ? yPositionExtent[0] - 30 : yPositionExtent[1] + 20,
        x: value2X(tick),
        alignment: ['center', 'center'],
        sticky: options.sticky ? 'top' : undefined
      }
    });
    return {positions, labelGroups};
  }
}