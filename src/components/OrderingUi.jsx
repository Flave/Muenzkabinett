import React from 'react';
import _find from 'lodash/find';
import properties from 'constants/coinProperties';
import stateStore from 'app/stateStore';
import layouts from 'app/layouts';

class OrderingUi extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      activeIndex: null
    }
    this.boundHidePropertiesList = this.hidePropertiesList.bind(this);
    //hack to make dropdown menu not close when other property is clicked
    this.stopHiding = false;
  }

  componentDidMount() {
    
  }

  createPropertiesList() {
    var state = this.props.state,
        componentState = this.state,
        activeIndex = componentState.activeIndex,
        otherIndex = activeIndex + 1 - 2 * activeIndex,
        selectedProperty = state.selectedProperties[activeIndex],
        otherSelectedProperty = state.selectedProperties[otherIndex]

    return (
      <div className="ordering-ui__property-list">
        { 
          properties.map(function(property, i) {
            if(property.key === "title") return undefined;
            var className = "btn ordering-ui__property";
            if(selectedProperty && selectedProperty.key === property.key)
              className += " is-selected";
            if(otherSelectedProperty && otherSelectedProperty.key === property.key)
              className += " is-disabled is-selected";
            return <div key={i} onClick={this.handlePropertyClick.bind(this, property, i)} className={className}>{property.value}</div>
          }.bind(this))
        }
        <div onClick={this.handlePropertyClick.bind(this, null)} className="btn">Clear Property</div>
      </div>
    )
  }

  createSelectedPropertyButton(property, propertyIndex) {
    var className = "btn ordering-ui__selected-property",
        value = property ? property.value : "Select a property";

    className += !property ? " is-empty" : "";
    className += this.state.activeIndex === propertyIndex ? " is-selected" : "";

    return <div onClick={this.handleSelectionClick.bind(this, propertyIndex)} className={className}>{value}</div>
  }

  hidePropertiesList() {
    if(this.stopHiding) {
      this.stopHiding = false;
    } else {
      document.removeEventListener('click', this.boundHidePropertiesList);
      this.setState({activeIndex: null});
    }
  }

  handleSelectionClick(propertyIndex, proxy, event) {
    if(this.state.activeIndex === propertyIndex)
      this.setState({activeIndex: null});
    else
      this.setState({activeIndex: propertyIndex});

    document.addEventListener('click', this.boundHidePropertiesList);

    // if dropdown was already open and now the other property button was clicked, don't hide the menu
    if(this.state.activeIndex !== null && this.state.activeIndex !== propertyIndex)
      this.stopHiding = true;
  }

  handlePropertyClick(property, i) {
    var state = stateStore.get(),
        selectedProps = state.selectedProperties,
        activeIndex = this.state.activeIndex,
        selectedProperty = selectedProps[activeIndex];
    
    // property is "null" or if selected property was already selected set property to null
    if(!property || (selectedProperty && (selectedProperty.key === property.key)))
      selectedProps[activeIndex] = null;
    else
      selectedProps[activeIndex] = property;

    var newLayout = layouts.getApplicableLayout(state)
    stateStore.set({selectedProperties: selectedProps, selectedLayout: newLayout.key});
  }

  render() {
    var state = this.props.state
    return (
      <div className="ordering-ui">
        {this.state.activeIndex === null ? undefined : this.createPropertiesList()}
        <div className="ordering-ui__selection">
          {this.createSelectedPropertyButton(state.selectedProperties[0], 0)}
          {this.createSelectedPropertyButton(state.selectedProperties[1], 1)}
        </div>
      </div>
    );
  }
}

export default OrderingUi;