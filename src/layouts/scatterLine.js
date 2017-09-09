import {randomNormal as d3_randomNormal} from 'd3-random';
import {scaleLinear as d3_scaleLinear} from 'd3-scale';
import {groupContinuous, getCoinsBounds, getExtent} from 'app/utility';

export default {
  key: 'scatter_line',
  value: 'Scatter Line',
  requiredTypes: ['continuous'],
  create: function plainGrid(coins, properties, {cy, cx, height}, options={}) {
    const property = options.property || properties[0];
    const domain = options.domainX || getExtent(coins, property.key);
    const groups = groupContinuous(coins, property, domain);
    const baseY = options.baseY !== undefined ? options.baseY : cy;
    const maxSpreadY = height / 1000;
    const spreadDivider = options.spreadDivider || 1;
    const spacingX = 200;
    const spreadX = spacingX/2;
    const rangeDelta = groups.length * spacingX;
    const range = [cx - rangeDelta/2, cx + rangeDelta/2];
    const value2X = d3_scaleLinear().domain(domain).range(range);
    const ticks = value2X.nice().ticks();
    const yPositionExtent = [Infinity, -Infinity];
    const positions = [];
    const labelGroups = [{key: property.key}];

    groups.forEach(function(group, groupIndex) {
      group.forEach(function(coin) {
        const spreadY = (maxSpreadY * Math.sqrt(group.length)) / spreadDivider;
        const xOffset = value2X(coin.data[property.key]) - coin.width/2 + d3_randomNormal(0, 40)();
        const x = xOffset;
        const y = baseY + d3_randomNormal(0, spreadY)();

        positions.push({x, y});
        coin.move(x, y);
        yPositionExtent[0] = yPositionExtent[0] < y ? yPositionExtent[0] : y;
        yPositionExtent[1] = yPositionExtent[1] > y ? yPositionExtent[1] : y;
      });
    });

    labelGroups[0].labels = ticks.map(tick => {
      return {
        value: tick,
        y: yPositionExtent[1],
        x: value2X(tick),
        alignment: 'center'
      }
    });

    return {positions, labelGroups};
  }
}