import {getPaddedDimensions, getDiscreteProperty, getContinuousProperty, groupDiscrete, getExtent} from 'app/utility';
import scatterLine from './scatterLine';

export default {
  key: 'scatter_lines',
  value: 'Scatter Lines',
  requiredTypes: ['discrete', 'continuous'],
  create: function plainGrid(coins, properties, bounds) {
    var discreteProperty = getDiscreteProperty(properties),
        continuousProperty = getContinuousProperty(properties),
        showTop = 10,
        groups = groupDiscrete(coins, discreteProperty.key),
        paddedDimensions = getPaddedDimensions(bounds, {left: 300, right: 0.05, top: 0.05, bottom: 0.05}),
        lineSpacing = paddedDimensions.height / showTop,
        maxSpreadY = bounds.height / groups.length,
        extentX = getExtent(coins, continuousProperty.key),
        positions = [],
        labels = [];

    groups.forEach((group, groupIndex) => {
      const baseY = paddedDimensions.top + lineSpacing * groupIndex + (lineSpacing/2);
      const options = {
        baseY,
        property: continuousProperty,
        maxSpreadY: maxSpreadY,
        extentX: extentX,
        spreadDivider: 5
      }
      labels.push({
        value: group.key,
        key: discreteProperty.key,
        x: paddedDimensions.left - 280,
        y: baseY,
        minZoom: groupIndex % 2 === 0 ? .2 : .3,
        selectable: true
      });
      positions.push.apply(positions, scatterLine.create(group.coins, properties, paddedDimensions, options));
    });
    return {positions, labels};
  }
}