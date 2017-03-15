import React from 'react';
import _find from 'lodash/find';
import properties from 'constants/coinProperties';
import stateStore from 'app/stateStore';
import layouts from 'app/layouts';

class TagList extends React.Component {

  handleClick(tag, i) {
    var newState = stateStore.get(true),
        newSelectedProps = newState.selectedProperties;

    newSelectedProps.push(tag);
    if(newSelectedProps.length > 2)
      newSelectedProps.shift();

    var newLayout = layouts.getApplicableLayout(newState)
    stateStore.set({selectedProperties: newSelectedProps, selectedLayout: newLayout});
  }

  createTags() {
    return properties.map(function(property, i) {
      var className = "tag-list__tag";
      if(this.props.state.selectedProperties.indexOf(property) !== -1)
        className += " is-selected";
      return <span key={i} onClick={this.handleClick.bind(this, property, i)} className={className}>{property.value}</span>
    }.bind(this));
  }

  render() {
    return (
      <div className="tag-list">
        {this.createTags()}
      </div>
    );
  }
}

export default TagList;