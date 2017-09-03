import React from 'react';
const SPACING = 35;

class FilterUi extends React.Component {
  createClearButton(numFilters) {
    return (
      <span 
        style={{
          bottom: `${numFilters * SPACING}px`
        }}
        onClick={this.props.onClear} 
        className="filter-ui__filter filter-ui__filter--clear">
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
            bottom: `${filters.length * SPACING - (groupIndex + 1) * SPACING}px`
          }}
          key={groupIndex} 
          className="filter-ui__filter">
          <span className={`filter-ui__icon icon-${key}`}></span>
          {value}
          <span 
            onClick={this.props.onClick.bind(null, {key, value})}
            className="icon-cross filter-ui__clear"></span>
        </span>
      );
    });
  }

  render() {
    const {filters} = this.props;
    return (
      <div className="filter-ui">
        {filters.length > 1 && this.createClearButton(filters.length)}
        {this.createFilterTags()}
      </div>
    );
  }
}

export default FilterUi;