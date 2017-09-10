import {getDiscreteProperty, getContinuousProperty, groupDiscrete, getExtent, getCoinsBounds} from 'app/utility';
import scatterLine from './scatterLine';

export default {
  key: 'scatter_lines',
  value: 'Scatter Lines',
  requiredTypes: ['discrete', 'continuous'],
  create: function plainGrid(coins, properties, {top, cx}) {
    const MARGIN_LEFT = 150; // margin for labels
    const discreteProperty = getDiscreteProperty(properties);
    const continuousProperty = getContinuousProperty(properties);
    const groups = groupDiscrete(coins, discreteProperty.key);
    const LINE_SPACING = 500;
    const domain = getExtent(coins, continuousProperty.key);
    const positions = [];
    const labelGroups = [{key: discreteProperty.key, labels: []}];

    groups.forEach((group, groupIndex) => {
      const groupCy = top + LINE_SPACING * groupIndex + (LINE_SPACING/2);
      const options = {
        domain,
        ySpreadFactor: 8,
        sticky: true,
        labelsPos: 'top'
      }
      labelGroups[0].labels.push({
        value: group.key,
        key: discreteProperty.key,
        y: groupCy,
        minZoom: groupIndex % 2 === 0 ? .12 : .16,
        selectable: true,
        alignment: ['right', 'center'],
        sticky: 'left'
      });

      const layoutSpec = scatterLine.create(group.coins, [continuousProperty], {cx, cy: groupCy}, options)
      positions.push.apply(positions, layoutSpec.positions);
    
      if(groupIndex === 0)
        labelGroups.push(layoutSpec.labelGroups[0]);
    });

    const bounds = getCoinsBounds(positions);

    labelGroups[0].labels.forEach((label) => label.x = bounds.left - 30)

    bounds.left -= MARGIN_LEFT;

    return {positions, labelGroups, bounds, alignment: 'top'};
  }
}