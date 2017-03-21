import {dispatch as d3_dispatch} from 'd3-dispatch';
import layouter from 'app/layouts';
import rebind from 'utility/rebind';
import _cloneDeep from 'lodash/cloneDeep';
import _assign from 'lodash/assign';
import _find from 'lodash/find';
import _forEach from 'lodash/forEach';

var _state = {
  selectedProperties: [],
  selectedLayout: _find(layouter.getLayouts(), {key: 'pile'}),
  selectedCoin: null,
  selectedCoins: [],
  notSelectedCoins: [],
  coinsProgress: 0,
  onboardingState: 0,
  selecting: false
};

var _prevState = {};
var changedProperties = [];

var dispatch = d3_dispatch('change');
var stateStore = {};

var setters = {
  selectedProperties: function(oldProp, newProp, key) {
    if(newProp.length > 2)
      newProp.shift();

    _state[key] = newProp;
    var applicableLayouts = layouter.getApplicableLayouts(_state);
    _state.selectedLayout = applicableLayouts[0].key;
  }
}

stateStore.get = function() {
  return _state;
}

stateStore.didPropertiesChange = function(keys) {
  var changed = false;

  _forEach(keys, (key) => {
    if(changed) return;
    if(changedProperties.indexOf(key) !== -1)
      changed = true;
  });
  return changed;
}

stateStore.getChangedProperties = function() {
  return changedProperties;
}

stateStore.getPrevious = function() {
  return _prevState;
}

stateStore.set = function(key, value, update) {
  _prevState = _state;
  if(setters[key] !== undefined)
    setters[key](_state[key], value, key);
  else
    _state[key] = value;
  if(update !== false)
    dispatch.call('change', _state, key);
}

stateStore.set = function(newProps, update) {
  _prevState = _state;
  changedProperties = [];
  /*
    Question is whether properties should be new clones of the old ones or not...the updating of canvas object depends on it
  */
  _forEach(newProps, (prop, key) => {
    changedProperties.push(key);
  });

  _state = _assign({}, _state, newProps);
  if(update !== false)
    dispatch.call('change', _state, _prevState);
}

export default rebind(stateStore, dispatch, 'on');