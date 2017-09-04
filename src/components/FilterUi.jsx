import React from 'react';
const TAG_SPACING = 35;
const SECTION_SPACING = 20;

class FilterUi extends React.Component {
  getSectionHeights() {
    const {filters, selecting, selectedCoin, selectedCoins} = this.props;
    // additional tag for clear button
    const filterTags = filters.length > 1 ? filters.length + 1 : filters.length;
    // only add spacing if filters selected
    const lassoSpacing = filters.length ? SECTION_SPACING : 0;
    return {
      filters: filterTags * TAG_SPACING,
      lasso: (selectedCoins.length ? 2 : 1) * TAG_SPACING + lassoSpacing
    }
  }

  createSelectedCoinTag() {
    const heights = this.getSectionHeights();
    const {selectedCoin} = this.props;
    return (
      <span 
        style={{
          bottom: `${heights.filters + heights.lasso + SECTION_SPACING}px`
        }}
        className="filter-ui__filter">
        <span className={`filter-ui__icon icon-coin`}></span>
        {selectedCoin.data.title}
        <span 
          onClick={this.props.onDeselectCoin}
          className="icon-cross filter-ui__clear"></span>
      </span>
    )
  }

  createLassoSection() {
    const heights = this.getSectionHeights();
    const {filters, selecting, selectedCoins} = this.props;
    const hasSelection = selectedCoins.length > 0;
    let lassoTagY = filters.length ? (heights.filters + SECTION_SPACING) : 0;
    let className = "filter-ui__filter";
    className += selecting ? " filter-ui__filter--alert" : " filter-ui__filter--utility";
    lassoTagY += hasSelection ? TAG_SPACING : 0;
    const lassoTag = (
      <span 
        key={0}
        onClick={this.props.onToggleLasso}
        style={{bottom: `${lassoTagY}px`}}
        className={className}>
        <span className={`filter-ui__icon icon-selection`}></span>
        {selecting ? "Stop selecting" : "Lasso"}
      </span>
    )
    const selectionTag = (
      <span 
        key={1}
        onClick={this.props.onClearLasso}
        style={{bottom: `${lassoTagY - TAG_SPACING}px`}}
        className="filter-ui__filter">
        <b>{selectedCoins.length}</b>&nbsp;Selected Coins
        <span className="filter-ui__clear icon-cross"></span>
      </span>
    )
    return hasSelection ? [lassoTag, selectionTag] : [lassoTag];
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
    
    return filters.map(({key, value}, groupIndex) => {
      return (
        <span 
          style={{
            bottom: `${filters.length * TAG_SPACING - (groupIndex + 1) * TAG_SPACING}px`
          }}
          key={groupIndex} 
          className="filter-ui__filter">
          <span className={`filter-ui__icon icon-${key}`}></span>
          {value}
          <span 
            onClick={this.props.onFilterRemove.bind(null, {key, value})}
            className="icon-cross filter-ui__clear"></span>
        </span>
      );
    });
  }

  render() {
    const {filters, selectedCoin} = this.props;
    return (
      <div className="filter-ui">
        {filters.length > 1 && this.createClearButton(filters.length)}
        {selectedCoin && this.createSelectedCoinTag()}
        {this.createLassoSection()}
        {this.createFilterTags()}
      </div>
    );
  }
}

export default FilterUi;