import {sum as d3_sum} from 'd3-array';
import {randomNormal as d3_randomNormal} from 'd3-random';
import _find from 'lodash/find';
import _forEach from 'lodash/forEach';
import Victor from 'victor';
import coinProperties from 'constants/coinProperties';

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
  create: function(coins, selectedCoin, bounds, cb) {
    var width = bounds.right - bounds.left,
        height = bounds.bottom - bounds.top,
        centerX = bounds.left + width/2,
        centerY = bounds.top + height/2,
        x, y,
        baseRadius = 1000,
        outerBelt = 0,
        innerBelt = 300,
        maxSimilarity = d3_sum(coinProperties, function(property) {return property.similarityWeight;}),
        similarityWidth = baseRadius - outerBelt - innerBelt,
        positions = [];

    // update selected coin
    x = centerX - selectedCoin.width/2;
    y = centerY;
    positions.push({x, y});
    selectedCoin.move(x, y);

    coins.forEach(function(coin, i) {
      if(coin.data.id === selectedCoin.data.id) {return;}
      else {
        var similarity = getSimilarity(selectedCoin, coin),
            similarityOffset = similarity.value / maxSimilarity * similarityWidth - d3_randomNormal(0, 30)(),
            radiusScatter = Math.abs(d3_randomNormal(0, width/10)()) + baseRadius - d3_randomNormal(0, 20)(),
            radius = similarity.properties.length ? (baseRadius - similarityOffset - outerBelt) : radiusScatter,
            delta = new Victor(coin.x - centerX, coin.y - centerY);

        delta.normalize().multiply(new Victor(radius, radius))
        x = centerX + delta.x;
        y = centerY + delta.y;
      }

      positions.push({x, y});
      coin.move(x, y);
    });
    return {positions};
  }
}