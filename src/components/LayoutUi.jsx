import React from 'react';
import layouts from 'app/layouts';
import stateStore from 'app/stateStore';

class LayoutUi extends React.Component {

  handleClick(layout) {
    const {hintStep} = stateStore.get();
    stateStore.set({
      selectedLayout: layout.key,
      selectedCoin: null,
      showHints: false,
      hintStep: hintStep === 1 ? 2 : hintStep
    });

    setTimeout(() => {
      // wait until relayouting finished
      // if the new layout actually has clickable labels show hints again
      stateStore.set({
        showHints: layout.requiredTypes.indexOf('discrete') !== -1 ? true : false
      })
    }, 1000);
  }

  createLayoutsList() {
    var state = this.props.state;
    return layouts.getApplicableLayouts(state.selectedProperties).map(function(layout, i) {
      var className = 'layout-list__layout';
      className += state.selectedLayout === layout.key ? ' is-selected' : '';
      return (
        <div 
          key={layout.key} 
          data-hint={i === 0 ? 'layout' : ''}
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