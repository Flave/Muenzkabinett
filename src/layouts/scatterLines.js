import {getPaddedDimensions, getDiscreteProperty, getContinuousProperty, groupDiscrete, getExtent} from 'app/utility';
import scatterLine from './scatterLine';

export default {
  key: 'scatter_lines',
  value: 'Scatter Lines',
  requiredTypes: ['discrete', 'continuous'],
  create: function plainGrid(coins, properties, bounds) {
    const discreteProperty = getDiscreteProperty(properties);
    const continuousProperty = getContinuousProperty(properties);
    const showTop = 10;
    const groups = groupDiscrete(coins, discreteProperty.key);
    const paddedDimensions = getPaddedDimensions(bounds, {left: 300, right: 0.05, top: 0.05, bottom: 0.05});
    const lineSpacing = paddedDimensions.height / showTop;
    const maxSpreadY = bounds.height / groups.length;
    const extentX = getExtent(coins, continuousProperty.key);
    const positions = [];
    const labelGroups = [{key: discreteProperty.key, labels: []}];

    groups.forEach((group, groupIndex) => {
      const baseY = paddedDimensions.top + lineSpacing * groupIndex + (lineSpacing/2);
      const options = {
        baseY,
        property: continuousProperty,
        maxSpreadY: maxSpreadY,
        extentX: extentX,
        spreadDivider: 5
      }
      labelGroups[0].labels.push({
        value: group.key,
        key: discreteProperty.key,
        x: paddedDimensions.left - 50,
        y: baseY,
        minZoom: groupIndex % 2 === 0 ? .2 : .3,
        selectable: true,
        alignment: "right"
      });
      const scatterLineSpec = scatterLine.create(group.coins, properties, paddedDimensions, options)
      positions.push.apply(positions, scatterLineSpec.positions);
    });
    return {positions, labelGroups};
  }
}