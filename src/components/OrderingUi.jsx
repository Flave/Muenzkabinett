import React from 'react';
import _find from 'lodash/find';
import properties from 'constants/coinProperties';
import stateStore from 'app/stateStore';
import layouts from 'app/layouts';

class OrderingUi extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      activeProperty: null
    }
    this.boundHidePropertiesList = this.hidePropertiesList.bind(this);
    //hack to make dropdown menu not close when other property is clicked
    this.stopHiding = false;
  }

  componentDidMount() {
    
  }

  createPropertiesList() {
    return properties.map(function(property, i) {
      var className = "ordering-ui__tag";
      if(this.props.state.selectedProperties.indexOf(property) !== -1)
        className += " is-selected";
      return <div key={i} onClick={this.handlePropertyClick.bind(this, property, i)} className={className}>{property.value}</div>
    }.bind(this));
  }

  createSelectedPropertyButton(property, propertyIndex) {
    var className = "ordering-ui__selected-property",
        value = property ? property.value : "Select a property";

    className += !property && "is-empty";

    return <div onClick={this.handleSelectionClick.bind(this, propertyIndex)} className={className}>{value}</div>
  }

  hidePropertiesList() {
    if(this.stopHiding) {
      this.stopHiding = false;
    } else {
      document.removeEventListener('click', this.boundHidePropertiesList);
      this.setState({activeProperty: null});
    }
  }

  handleSelectionClick(propertyIndex, proxy, event) {
    if(this.state.activeProperty === propertyIndex)
      this.setState({activeProperty: null});
    else
      this.setState({activeProperty: propertyIndex});

    document.addEventListener('click', this.boundHidePropertiesList);

    // if dropdown was already open and now the other property button was clicked, don't hide the menu
    if(this.state.activeProperty !== null && this.state.activeProperty !== propertyIndex)
      this.stopHiding = true;
  }

  handlePropertyClick(tag, i) {
    var newState = stateStore.get(true),
        newSelectedProps = newState.selectedProperties;

    newSelectedProps.push(tag);
    if(newSelectedProps.length > 2)
      newSelectedProps.shift();

    var newLayout = layouts.getApplicableLayout(newState)
    stateStore.set({selectedProperties: newSelectedProps, selectedLayout: newLayout});
  }

  render() {
    var state = this.props.state

    return (
      <div className="ordering-ui">
        <div className="ordering-ui__property-list">
          {this.state.activeProperty === null ? undefined : this.createPropertiesList()}
        </div>
        <div className="ordering-ui__selection">
          {this.createSelectedPropertyButton(state.selectedProperties[0], 0)}
          {this.createSelectedPropertyButton(state.selectedProperties[1], 1)}
        </div>
      </div>
    );
  }
}

export default OrderingUi;