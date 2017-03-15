import {sum as d3_sum} from 'd3-array';
import {randomNormal as d3_randomNormal} from 'd3-random';
import _find from 'lodash/find';
import _forEach from 'lodash/forEach';
import Victor from 'victor';
import constants from 'constants/coinProperties';

var coinProperties = constants.coinProperties;

function getSimilarity(selectedCoin, coin) {
  var similarity = {properties: [], value: 0};
  _forEach(coinProperties, function(property) {
    if(selectedCoin.data[property.key] === coin.data[property.key]) {
      similarity.value += property.similarityWeight;
      similarity.properties.push({key: property.key, value: coin.data[property.key]});
    }
  });
  return similarity;
}

export default {
  create: function plainGrid(coins, state, bounds, coinsBounds) {
    var width = bounds.right - bounds.left,
        height = bounds.bottom - bounds.top,
        centerX = bounds.left + width/2,
        centerY = bounds.top + height/2,
        selectedCoin = _find(coins, function(coin) {return coin.data.id === state.selectedCoin; }),
        baseRadius = 1000,
        outerBelt = 0,
        innerBelt = 300,
        duration = 1000,
        maxSimilarity = d3_sum(coinProperties, function(property) {return property.similarityWeight;}),
        similarityWidth = baseRadius - outerBelt - innerBelt;

    coins.forEach(function(coin, i) {
      if(coin.data.id === selectedCoin.data.id) {
        coin.move(centerX - coin.width/2, centerY, duration, Math.random() * 500);
        return;
      }
      var similarity = getSimilarity(selectedCoin, coin),
          similarityOffset = similarity.value / maxSimilarity * similarityWidth - d3_randomNormal(0, 30)(),
          radiusScatter = Math.abs(d3_randomNormal(0, width/10)()) + baseRadius - d3_randomNormal(0, 20)(),
          radius = similarity.properties.length ? baseRadius - similarityOffset - outerBelt : radiusScatter,
          delta = new Victor(coin.x - centerX, coin.y - centerY);

          delta.normalize().multiply(new Victor(radius, radius))
      coin.move(centerX + delta.x, centerY + delta.y, duration, Math.random() * 500);
    });
  }
}