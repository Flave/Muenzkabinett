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
        <span 
          key={layout.key} 
          onClick={this.handleClick.bind(this, layout)} 
          className={`${className} icon icon-${layout.key}`}></span>
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