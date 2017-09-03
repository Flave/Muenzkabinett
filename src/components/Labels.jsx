import React from 'react';
import Label from 'components/Label';
import _find from 'lodash/find';

class SelectionUi extends React.Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }
  componentDidUpdate() {
    //console.dir(this.root);
  }

  // function onMouseUp(event) {
  //   if(!recording) return;
  //   recording = false;
  //   setLineStyle();
  //   graphics.lineTo(currentPolygonData[0].x, currentPolygonData[0].y);
  //   polygonsData.push(currentPolygonData);
  //   currentPolygonData = [];
  //   dispatch.call('selection');

  //   if(!event.data.originalEvent.shiftKey)
  //     stopRecording();
  // }

  // function onKeyUp(event) {
  //   if(event.key === 'Shift')
  //     stopRecording();
  // }

  handleClick(propertyKey, value, e) {
    const labelGroup = _find(this.props.labels, {key: propertyKey});
    const label = _find(labelGroup.labels, {value});
    this.props.onLabelClick([label]);
  }

  isInsideBounds({x, y}, {left, top, right, bottom}) {
    return (x > left) && (x < right) && (y > top) && (y < bottom);
  }

  createLabel(key, label, i) {
    const {bounds, transform} = this.props;
    const isInside = this.isInsideBounds(label, bounds);
    if(transform.k < label.minZoom || !isInside) return;
    return (
      <Label 
        {...label}
        key={i}
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