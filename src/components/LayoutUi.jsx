import React from 'react';
import layouts from 'app/layouts';
import stateStore from 'app/stateStore';

class LayoutUi extends React.Component {

  handleClick(layout) {
    stateStore.set({selectedLayout: layout.key, selectedCoin: null});
  }

  createLayoutsList() {
    var state = this.props.state;
    return layouts.getApplicableLayouts(state.selectedProperties).map(function(layout) {
      var className = 'layout-list__layout';
      className += state.selectedLayout === layout.key ? ' is-selected' : '';
      return (
        <div 
          key={layout.key} 
          onClick={this.handleClick.bind(this, layout)} 
          className={className}>
          <span className={`layout-list__layout-icon icon-${layout.key}`}></span>
          <div className="layout-list__tooltip">
            <div className="layout-list__tooltip-title">{layout.value}</div>
            <div className="layout-list__tooltip-copy">{layout.description}</div>
          </div>
        </div>
      )
    }.bind(this))
  }

  render() {
    return (
      <div className="layout-list">
        {this.createLayoutsList()}
      </div>
    );
  }
}

export default LayoutUi;