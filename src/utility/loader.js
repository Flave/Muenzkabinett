import {Texture, utils, Sprite, autoDetectRenderer, Container, Rectangle} from 'pixi.js';
import {loaders as pixiLoaders} from 'pixi.js';
import {dispatch as d3_dispatch} from 'd3-dispatch';
import {range as d3_range} from 'd3-array';
import {csv as d3_csv} from 'd3-request';
import coinsContainer from 'app/components/Coins';
import Coin from 'app/Coin';
import rebind from 'utility/rebind';
import stateStore from 'app/stateStore';

var loader = {},
    dispatch = d3_dispatch('coinsLoaded', 'actorsLoaded', 'linksLoaded', 'coinsProgress');

var numCoins = 26705,
    coinsData = null,
    spritesLoaded = 0;

loader.load = function() {
  loadCoins();
  return loader;
}

/*
* Loads coins.csv and afterwards the corresponding spritesheets
*/
function loadCoins() {
  
  loadCsv("data/csv/coins.csv", handleDataLoaded);
}

function handleDataLoaded(err, _coinsData) {
  if(err) console.log(err);
  else {
    //coinsData = _coinsData.slice(0, 6001);
    coinsData = _coinsData;
    
    loadSpriteSheets(handleLoadingComplete, handleResourceLoaded);
  }
}

function handleLoadingComplete() {
  dispatch.call('coinsLoaded', loader);
}


function handleResourceLoaded(spriteLoader, resource) {
  var fileNames = createSpriteFileNames("coins", 40, coinsData.length, 2000);
  createCoins(spriteLoader, resource, coinsData);
  spritesLoaded++;
  var progress = spritesLoaded / fileNames.length;
  stateStore.set({coinsProgress: progress});
}

/*
* Creates coins sprites, adds its data to it and adds the coins to the coinsstore
* loader should be responsible for creating the coins because all the necessary data is here.
* another component adds them to the canvas and gives them behavior
*/
function createCoins(spriteLoader, resource) {
  var extent = resource.name.split("_").map(function(number) {return parseInt(number)}).slice(1,3);
  d3_range(extent[0], extent[1]).map(function(coinIndex) {
    
    var coinData = coinsData[coinIndex],
        texture = new Texture(spriteLoader.resources[resource.name].texture),
        rectangle = new Rectangle(coinData.x, coinData.y, coinData.width, coinData.height);
    texture.frame = rectangle;
    coinsContainer.add(Coin(texture, coinData));
  });
}

/*
* Loads a bunch of sprite sheets from alist of filenames
*/
function loadSpriteSheets(onComplete, onProgress) {
  var fileNames = createSpriteFileNames("coins", 40, coinsData.length, 2000),
      spriteLoader = new pixiLoaders.Loader();
  fileNames.forEach(function(fileSpec) {
    spriteLoader.add(fileSpec);
  })

  spriteLoader.load(function(loader, results) {
    onComplete(null);
  })
  .onProgress.add(onProgress);
}

/*
* Create a list of sprite file names and urls to load
*/
function createSpriteFileNames(name, height, numSprites, spritesPerFile) {
  return d3_range(Math.ceil(numSprites/spritesPerFile)).map(function(fileIndex) {
    var lowerEnd = fileIndex * spritesPerFile,
        upperEnd = (fileIndex + 1) * spritesPerFile >= numSprites ? numSprites - 1 : (fileIndex + 1) * spritesPerFile;
    return {
      name: `${name}_${lowerEnd}_${upperEnd}`, 
      url: `data/images/sprites/${name}_sprites_${height}_${lowerEnd}_${upperEnd}.png`
    };
  });
}


function loadCsv(url, callback) {
  d3_csv(url, parseNumbers, function(err, data) {
    callback(null, data);
  });
}

function parseNumbers(object, index, keys) {
  keys.forEach(function(key) {
    var val = parseFloat(object[key]);
    object[key] = isNaN(val) ? object[key] : val;
  });
  return object;
}

export default rebind(loader, dispatch, 'on');