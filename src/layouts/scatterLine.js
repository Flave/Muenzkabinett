import {randomNormal as d3_randomNormal} from 'd3-random';
import {scaleLinear as d3_scaleLinear} from 'd3-scale';
import {extent as d3_extent} from 'd3-array';
import {getPaddedDimensions, groupContinuous, getExtent} from 'app/utility';

export default {
  key: 'scatter_line',
  value: 'Scatter Line',
  requiredTypes: ['continuous'],
  create: function plainGrid(coins, properties, bounds, options={}) {
    var property = options.property || properties[0];
    var extentX = options.extentX || getExtent(coins, property.key);
    var groups = groupContinuous(coins, property, extentX);
    var height = bounds.bottom - bounds.top;
    var paddedDimensions = getPaddedDimensions(bounds, 0.03);
    var baseY = options.baseY !== undefined ? options.baseY : bounds.top + height/2;
    var spacingX = paddedDimensions.width / groups.length;
    var maxSpreadY = height / 1000;
    var spreadX = spacingX/2;
    var spreadDivider = options.spreadDivider || 1;
    var positions = [];
    var value2X = d3_scaleLinear().domain(extentX).range([bounds.left, bounds.right]);
    var ticks = value2X.nice().ticks();
    var yPositionExtent = [Infinity, -Infinity];
    const labelGroups = [{key: property.key}];

    groups.forEach(function(group, groupIndex) {
      group.forEach(function(coin, coinIndex) {
        var spreadY = (maxSpreadY * Math.sqrt(group.length)) / spreadDivider,
            xOffset = groupIndex * spacingX - d3_randomNormal(coin.width/2, spreadX)() - 5,
            x = paddedDimensions.left + xOffset,
            y = baseY + d3_randomNormal(0, spreadY)();

        positions.push({x: x, y: y});
        coin.move(x, y, 1000, Math.random() * 500);
        yPositionExtent[0] = yPositionExtent[0] < y ? yPositionExtent[0] : y;
        yPositionExtent[1] = yPositionExtent[1] > y ? yPositionExtent[1] : y;
      });
    });

    labelGroups[0].labels = ticks.map(tick => {
      return {
        value: tick,
        y: yPositionExtent[1],
        x: value2X(tick)
      }
    });

    return {positions, labelGroups};
  }
}