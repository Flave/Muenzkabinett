import {Texture, Rectangle} from 'pixi.js';
import {loaders as pixiLoaders} from 'pixi.js';
import {range as d3_range} from 'd3-array';
import {csv as d3_csv} from 'd3-request';
import coinsContainer from 'app/components/Coins';
import Coin from 'app/Coin';
import stateStore from 'app/stateStore';
import {COIN_HEIGHT, COINS_PER_SHEET, loadingSteps} from 'constants';

const loader = {};
const cachedCoins = []; // array used to retrieve coins quickly by index instead of _find

loader.load = function() {
  let data;

  DataLoader()
    .load()
    .done((err, _data) => {
      if(err) throw new Error(err);
      data = _data;

      stateStore.set({
        loadingStep: loadingSteps.LOW_RES,
        coinsProgress: 0
      });

      SheetsLoader(data, .25, '_0-25')
        .load(data)
        .progress((progress) => {
          stateStore.set({
            loadingStep: loadingSteps.LOW_RES,
            coinsProgress: progress
          });
        })
        .done(() => {
          stateStore.set({
            loadingStep: loadingSteps.HIGH_RES,
            coinsProgress: 0
          });

          setTimeout(() => {
            SheetsLoader(data, 1, '')
              .done(() => {
                stateStore.set({
                  loadingStep: loadingSteps.DONE,
                  coinsProgress: 1
                });              
              })
              .progress((progress) => {
                stateStore.set({
                  loadingStep: loadingSteps.HIGH_RES,
                  coinsProgress: progress
                });
              })
              .load(data);
          }, 3000);
        })
    });
  return loader;
}


function DataLoader() {
  const _dataLoader = {};
  let onDone;

  /*
  * Loads coins.csv and afterwards the corresponding spritesheets
  */
  _dataLoader.load = () => {
    loadCsv('data/csv/coins.csv');
    return _dataLoader;
  }

  _dataLoader.done = (cb) => {
    onDone = cb;
    return _dataLoader;
  }

  function loadCsv(url) {
    d3_csv(url, parseNumbers, function(err, data) {
      onDone(null, data);
    });
  }

  function parseNumbers(object, index, keys) {
    keys.forEach(function(key) {
      var val = parseFloat(object[key]);
      object[key] = isNaN(val) ? object[key] : val;
    });
    return object;
  }

  return _dataLoader;
}


function SheetsLoader(_data, _resolution, _suffix) {
  const _sheetsLoader = {};
  const spriteLoader = new pixiLoaders.Loader();
  const coinData = _data;
  const resolution = _resolution;
  const suffix = _suffix;
  let spritesLoaded = 0;
  let onDone;
  let onProgress;
  let sheetsSpecs = createSheetsSpecs('coins', COIN_HEIGHT, coinData.length, COINS_PER_SHEET);

  // Loads a bunch of sprite sheets from alist of filenames
  _sheetsLoader.load = () => {
    sheetsSpecs.forEach(function(fileSpec) {
      spriteLoader.add(fileSpec);
    })

    spriteLoader
      .load(() => {
        onDone();
      })
      .onProgress
      .add(handleResourceLoaded);
    return _sheetsLoader;
  }

  _sheetsLoader.done = (cb) => {
    onDone = cb;
    return _sheetsLoader;
  }

  _sheetsLoader.progress = (cb) => {
    onProgress = cb;
    return _sheetsLoader;
  }

  // Create a list of sprite file names and urls to load
  function createSheetsSpecs(name, height, numSprites, spritesPerFile) {
    return d3_range(Math.ceil(numSprites/spritesPerFile)).map(function(fileIndex) {
      const lowerEnd = fileIndex * spritesPerFile;
      const upperEnd = (fileIndex + 1) * spritesPerFile >= numSprites ? numSprites - 1 : (fileIndex + 1) * spritesPerFile;
      return {
        name: `${name}_${lowerEnd}_${upperEnd}`, 
        url: `data/images/sprites/${name}_sprites_${height}_${lowerEnd}_${upperEnd}${suffix}.png`
      };
    });
  }

  function handleResourceLoaded(loader, resource) {
    createCoins(loader, resource);
    spritesLoaded++;
    var progress = spritesLoaded / sheetsSpecs.length;
    onProgress(progress);
  }


  // Creates coins sprites, adds its data to it and adds the coins to the coinsstore
  // loader should be responsible for creating the coins because all the necessary data is here.
  // another component adds them to the canvas and gives them behavior
  function createCoins(loader, resource) {
    const extent = resource.name.split('_')
      .map((number) => {return parseInt(number)})
      .slice(1,3);

    function createCoin(coinIndex, i) {
      const data = coinData[coinIndex];
      const texture = new Texture(loader.resources[resource.name].texture);
      let x = data.x * resolution;
      let y = data.y * resolution;
      let width = data.width * resolution;
      let height = data.height * resolution;
      x = x + width > texture.width ? Math.floor(x) : x;
      y = y + height > texture.height ? Math.floor(y) : y;
      width = x + width >= texture.width ? Math.floor(width) : width;
      height = y + height >= texture.height ? Math.floor(height) : height;
      const rectangle = new Rectangle(x, y, width, height);
      texture.frame = rectangle;

      if(!cachedCoins[coinIndex]) {
        const coin = Coin(texture, data);
        coinsContainer.add(coin);
        cachedCoins[coinIndex] = coin;
      } else {
        cachedCoins[coinIndex].texture = texture;
      }
    }

    d3_range(extent[0], extent[1]).map(createCoin);
  }

  return _sheetsLoader;
}

export default loader;