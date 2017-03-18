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
        paddedDimensions = getPaddedDimensions(bounds, 0.05),
        lineSpacing = paddedDimensions.height / showTop,
        maxSpreadY = bounds.height / groups.length,
        extentX = getExtent(coins, continuousProperty.key);

    groups.forEach((group, groupIndex) => {
      if(groupIndex > showTop) {
        group.forEach((coin) => {
          coin.move(bounds.left - 100, bounds.top - 100, 1000, Math.random() * 500);
        });
        return;
      }

      var options = {
        baseY: paddedDimensions.top + lineSpacing * groupIndex + (lineSpacing/2),
        property: getContinuousProperty(properties),
        maxSpreadY: maxSpreadY,
        extentX: extentX,
        spreadDivider: 5
      }
      scatterLine.create(group, properties, bounds, options);
    });
  }
}