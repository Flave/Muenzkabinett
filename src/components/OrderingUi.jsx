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
        otherSelectedProperty = state.selectedProperties[otherIndex];

    return (
      <div className="ordering-ui__property-list">
        {
          properties.map(function(property, i) {
            if(!property.selectable) return undefined;
            const alreadySelected = otherSelectedProperty && otherSelectedProperty.key === property.key;
            const selected = selectedProperty && selectedProperty.key === property.key;
            let className = "ordering-ui__property";
            if(selected)
              className += " is-selected";
            if(alreadySelected)
              className += " is-disabled is-selected";
            return <div 
              key={i} 
              onClick={!alreadySelected && this.handlePropertyClick.bind(this, property, i)} 
              className={className}>
              <i className={`icon-${property.key}`}></i>
              {property.label}
              {selected && <i className="icon-cross ordering-ui__clear-icon"></i>}
              </div>
          }.bind(this))
        }
      </div>
    )
  }

  createPropertyUi(property, propertyIndex) {
    var className = "ordering-ui__ui",
        label = property ? property.label : "Select a property";

    className += !property ? " is-empty" : "";
    className += this.state.activeIndex === propertyIndex ? " is-selected" : "";

    return <div className={className}>
      {this.createPropertiesList()}
      <div 
        onClick={this.handleSelectionClick.bind(this, propertyIndex)} 
        className="ordering-ui__selection">
        {property && <i className={`icon-${property.key}`}></i>}
          {label}
        </div>
    </div>
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
        {this.createPropertyUi(state.selectedProperties[0], 0)}
        <span className="ordering-ui__meta">and</span>
        {this.createPropertyUi(state.selectedProperties[1], 1)}
      </div>
    );
  }
}

export default OrderingUi;