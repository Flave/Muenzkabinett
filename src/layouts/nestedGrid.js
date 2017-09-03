import {randomNormal as d3_randomNormal} from 'd3-random';
import {max as d3_max} from 'd3-array';
import {COIN_HEIGHT} from 'constants';
import {getPaddedDimensions, getDiscreteProperty, getContinuousProperty, groupDiscrete, getExtent} from 'app/utility';

const groupSorter = (key) =>
  (coinA, coinB) =>
    coinA.data[key] - coinB.data[key]

const createGrid = (coins) => {
  const numCols = Math.ceil(Math.sqrt(coins.length));
  const PADDING = 10;
  const SPACING = COIN_HEIGHT + PADDING;
  const width = numCols * SPACING;
  let rowIndex = 0;
  let lastCoinWidth = 0;
  let lastCoinX = 0;
  const positions = [];
  
  coins.map((coin, i) => {
    const xOffset = lastCoinX + lastCoinWidth + PADDING;
    const newRow = (xOffset + coin.width) > width;
    newRow && rowIndex++;
    const x = newRow ? 0 : xOffset;
    const y = rowIndex * SPACING;
    positions.push({x, y});
    lastCoinWidth = coin.width;
    lastCoinX = x;
  });

  return {positions, width, height: (rowIndex + 1) * SPACING}
}

export default {
  key: 'nested_grid',
  value: 'Nested Grid',
  requiredTypes: ['discrete', 'continuous'],
  create: function plainGrid(coins, properties, bounds) {
    const paddedDimensions = getPaddedDimensions(bounds, 0.05);
    const continuousProperty = getContinuousProperty(properties);
    const discreteProperty = getDiscreteProperty(properties);
    const groups = groupDiscrete(coins, discreteProperty.key);
    const sorter = groupSorter(continuousProperty.key);
    const positions = [];
    const labels = [];
    const PADDING = 60;
    let lastGroupEnd = paddedDimensions.left;
    const maxGroupSize = d3_max(groups, (group) => group.coins.length);

    groups.forEach((group, groupIndex) => {
      group.coins.sort(sorter);
      const numCoins = group.coins.length;
      const {width, height, positions} = createGrid(group.coins);
      const groupX = lastGroupEnd + PADDING + COIN_HEIGHT/2;
      const labelX = groupX + width/2;
      const labelY = numCoins < 10 ? paddedDimensions.top - 40 : paddedDimensions.top + height/2;
      let labelMinZoom = .4 - numCoins / maxGroupSize;

      labels.push({
        value: group.key,
        key: discreteProperty.key,
        x: labelX,
        y: labelY,
        minZoom: labelMinZoom,
        selectable: true,
        alignment: 'center'
      });

      group.coins.forEach((coin, i) => {
        const position = positions[i];
        const x = groupX + position.x;
        const y = paddedDimensions.top + position.y;
        positions.push({x, y});
        coin.move(x, y);
      });
      lastGroupEnd = groupX + width;
    });

    return {positions, labels};
  }
}