import _find from 'lodash/find';
import _forEach from 'lodash/forEach';
import _get from 'lodash/get';

const {gtag} = window;

const tracker = {};
const trackerConfig = [
  {
    propertyName: 'selectedProperties',
    createEvent: (properties, prevProperties) => {
      if(_get(properties, '[0].key') !== _get(prevProperties, '[0].key'))
        gtag('event', 'coin_property_one_changed', {
          event_category: 'coin_properties',
          event_action: 'coin_property_one_changed',
          event_label: _get(properties, '[0].key', 'none')
        })
      else
        gtag('event', 'coin_property_two_changed', {
          event_category: 'coin_properties',
          event_action: 'coin_property_two_changed',
          event_label: _get(properties, '[1].key', 'none')
        })
    }
  },
  {
    propertyName: 'selectedLayout',
    eventCategory: 'layout',
    eventName: 'layout_changed',
    eventAction: 'layout_changed'
  },
  {
    propertyName: 'coinFilters',
    createEvent: (filters, prevFilters) => {
      if(filters.length > prevFilters.length) {
        const newFilters = filters
          .slice(prevFilters.length, filters.length)
          .map(({key, value}) => `${key}_${value}`)
          .toString();

        const newFilterValues = filters
          .slice(prevFilters.length, filters.length)
          .map(({value}) => `${value}`)
          .toString();

        const newFilterKeys = filters
          .slice(prevFilters.length, filters.length)
          .map(({key}) => `${key}`)
          .toString();

        gtag('event', 'coin_filters_selected', {
          event_category: 'coin_filters',
          event_action: 'coin_filters_selected',
          event_label: newFilters,
          event_value: filters.length,
          event_filter_values: newFilterValues,
          event_filter_keys: newFilterKeys
        })
      }
      else {
        // get all the filters that were present but are no longer present
        const deselectedFilters = prevFilters.filter(({key}) => 
          !_find(filters, {key})
        )
        gtag('event', 'coin_filters_deselected', {
          event_category: 'coin_filters',
          event_action: 'coin_filters_deselected',
          event_label: deselectedFilters.map(({key, value}) => `${key}_${value}`).toString()
        })
      }
    }
  },
  {
    propertyName: 'selectedCoin',
    createEvent: (coin) => {
      if(coin)
        gtag('event', 'coin_selected', {
          event_category: 'selected_coin',
          event_action: 'selected_selected',
          event_label: coin.data.id
        })
      else
        gtag('event', 'coin_deselected', {
          event_category: 'selected_coin',
          event_action: 'selected_deselected',
          event_label: 'none'
        })
    }
  }
]

function checkProperty(prevState, property, propertyName) {
  const config = _find(trackerConfig, {propertyName});
  if(config) {
    if(config.createEvent)
      config.createEvent(property, prevState[propertyName]);
    else
      gtag('event', config.eventName, {
        event_category: config.eventCategory,
        event_action: config.eventAction,
        event_label: property
      })
  }
}

tracker.update = (changedProperties, prevState) => {
  if(!gtag) return;
  _forEach(changedProperties, checkProperty.bind(null, prevState));
}

export default tracker;