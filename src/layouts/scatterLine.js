import {randomNormal as d3_randomNormal} from 'd3-random';
import {scaleLinear as d3_scaleLinear} from 'd3-scale';
import {max as d3_max} from 'd3-array';
import {getPaddedDimensions, groupContinuous, getExtent} from 'app/utility';

export default {
  key: 'scatter_line',
  value: 'Scatter Line',
  requiredTypes: ['continuous'],
  create: function plainGrid(coins, properties, bounds, options={}) {
    var property = options.property || properties[0],
        extentX = options.extentX || getExtent(coins, property.key),
        groups = groupContinuous(coins, property, extentX),
        height = bounds.bottom - bounds.top,
        paddedDimensions = getPaddedDimensions(bounds, 0.03),
        value2X = d3_scaleLinear().domain(extentX).range([paddedDimensions.top, paddedDimensions.height]),
        baseY = options.baseY !== undefined ? options.baseY : bounds.top + height/2,
        spacingX = paddedDimensions.width / groups.length,
        maxGroupLength = d3_max(groups, function(group) {return group.length}),
        maxSpreadY = height / 1000,
        spreadX = spacingX/2,
        spreadDivider = options.spreadDivider || 1,
        newCoinPositions = [];

    groups.forEach(function(group, groupIndex) {
      group.forEach(function(coin, coinIndex) {
        var spreadY = (maxSpreadY * Math.sqrt(group.length)) / spreadDivider,
            xOffset = groupIndex * spacingX - d3_randomNormal(coin.width/2, spreadX)() - 5,
            x = paddedDimensions.left + xOffset,
            y = baseY + d3_randomNormal(0, spreadY)();

        newCoinPositions.push({x: x, y: y});
        coin.move(x, y, 1000, Math.random() * 500);
      });
    });
    return newCoinPositions;
  }
}