import React from 'react';
import layouts from 'app/layouts';
import stateStore from 'app/stateStore';

class LayoutList extends React.Component {

  handleClick(layout) {
    stateStore.set({selectedLayout: layout.key});
  }

  createLayoutsList() {
    return layouts.getLayouts().map(function(layout) {
      var className = "layout-list__layout"
      return (
        <span key={layout.key} onClick={this.handleClick.bind(layout)} className={`${className} icon icon-${layout.key}`}></span>
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

export default LayoutList;