import React from 'react';
import Label from 'components/Label';
import _find from 'lodash/find';

class SelectionUi extends React.Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
    this.handleKeyUp = this.handleKeyUp.bind(this);
    this.state = {
      selectedLabels: []
    }
    document.addEventListener('keyup', this.handleKeyUp);
  }

  componentWillUnmount() {
    document.removeEventListener('keyup', this.handleKeyUp); 
  }

  componentDidMount() {

  }

  handleKeyUp(event) {
    if(event.key === 'Shift') {
      const selectedLabels = this.state.selectedLabels.slice();
      this.setState({selectedLabels: []});
      this.props.onLabelClick(selectedLabels);
    }
  }

  handleClick(propertyKey, value, e) {
    const labelGroup = _find(this.props.labels, {key: propertyKey});
    const label = _find(labelGroup.labels, {value});
    const selectedLabels = this.state.selectedLabels.slice();
    selectedLabels.push(label);

    if(e.nativeEvent.shiftKey)
      this.setState({selectedLabels});
    else
      this.props.onLabelClick([label]);
  }

  isInsideBounds({x, y}, {left, top, right, bottom}) {
    return (x > left) && (x < right) && (y > top) && (y < bottom);
  }

  getStickyPosition({x, y, sticky, alignment}, {left, top}) {
    let xPos = x;
    let yPos = y;
    let newAlignment = alignment.slice();
    if(sticky === 'left' && x < left) {
      xPos = left + 30;
      newAlignment[0] = 'left';
      console.log(alignment);
    } else if(sticky === 'top' && y < top) {
      yPos = top + 50;
    }

    return {
      x: xPos,
      y: yPos,
      alignment: newAlignment
    }
  }

  createLabel(key, label, i) {
    const {bounds, transform} = this.props;
    const isInside = this.isInsideBounds(label, bounds);
    if(transform.k < label.minZoom || !isInside && !label.sticky) return;
    const isPreselected = _find(this.state.selectedLabels, {key, value: label.value}) !== undefined;
    if(!isInside) {
      let stickyPos = this.getStickyPosition(label, bounds);
      label = {...label, ...stickyPos};
    }
    return (
      <Label 
        {...label}
        key={i}
        isPreselected={isPreselected}
        transform={transform} 
        onClick={this.handleClick.bind(this, key)}/>
    )
  }

  render() {
    var {labels} = this.props;
    if(!labels || !labels.length) return <div/>;

    return (
      <div ref={(root) => this.root = root} className="labels">
        {labels.map((labelGroup, i) =>
          <div key={i}>
            {labelGroup.labels.map(this.createLabel.bind(this, labelGroup.key))}
          </div>
        )}
      </div>
    );
  }
}

export default SelectionUi;