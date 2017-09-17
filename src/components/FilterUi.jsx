import React from 'react';
const TAG_SPACING = 35;
const SECTION_SPACING = 30;

class FilterUi extends React.Component {
  getSectionHeights() {
    const {filters, selectedCoins} = this.props;
    const filterTags = filters.length > 1 ? filters.length + 1 : filters.length; // additional tag for clear button

    return {
      filters: filterTags * TAG_SPACING,
      coin: filters.length || selectedCoins.length
    }
  }

  createSelectedCoinTag() {
    const heights = this.getSectionHeights();
    const {selectedCoin, selectedCoins, filters} = this.props;
    const bottomSpacing = selectedCoins.length || filters.length ? SECTION_SPACING : 0;
    const bottom = heights.filters + bottomSpacing;
    return (
      <div>
        <span 
          className="filter-ui__section-label"
          style={{bottom: `${bottom + TAG_SPACING}px`}}>
          Selected Coin
        </span>
        <span 
          style={{
            bottom: `${bottom}px`
          }}
          className="filter-ui__filter">
          <span className={'filter-ui__icon icon-coin'}></span>
          {selectedCoin.data.title}
          <span 
            onClick={this.props.onDeselectCoin}
            className="icon-cross filter-ui__clear"></span>
        </span>
      </div>
    )
  }

  createClearButton(numFilters) {
    return (
      <span 
        style={{
          bottom: `${numFilters * TAG_SPACING}px`
        }}
        onClick={this.props.onClearFilters} 
        className="filter-ui__filter filter-ui__filter--utility">
        Clear
        <span className="icon-cross filter-ui__clear"></span>
      </span>
    );
  }

  createFilterTags() {
    const {filters} = this.props;
    const numTags = filters.length > 1 ? filters.length + 1 : 1;
    
    return (
      <div>
        <span 
          className="filter-ui__section-label"
          style={{bottom: `${numTags * TAG_SPACING}px`}}>
          Filters
        </span>
        {filters.map(({key, value}, groupIndex) => {
          return (
            <span 
              style={{
                bottom: `${filters.length * TAG_SPACING - (groupIndex + 1) * TAG_SPACING}px`
              }}
              key={groupIndex} 
              className="filter-ui__filter">
              <span className={`filter-ui__icon icon-${key}`}></span>
              {value !== '' ? value : 'Unknown'}
              <span 
                onClick={this.props.onFilterRemove.bind(null, {key, value})}
                className="icon-cross filter-ui__clear"></span>
            </span>
          );
        })}
      </div>
    )
  }

  render() {
    const {filters, selectedCoin} = this.props;

    return (
      <div className="filter-ui">
        {filters.length > 1 && this.createClearButton(filters.length)}
        {selectedCoin && this.createSelectedCoinTag()}
        {filters.length > 0 && this.createFilterTags()}
      </div>
    );
  }
}

export default FilterUi;