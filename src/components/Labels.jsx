import React from 'react';

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

  handleClick(label) {
    //TODO: Check for shift to be pressed if you figure out fucking react events
    this.props.onLabelClick(label);
  }

  isInsideBounds({x, y}, {left, top, right, bottom}) {
    return (x > left) && (x < right) && (y > top) && (y < bottom);
  }

  render() {
    var {labels, transform, bounds} = this.props;
    if(!labels || !labels.length) return <div/>;

    return (
      <div ref={(root) => this.root = root} className="labels">
        {labels.map((label, i) => {
          const isInside = this.isInsideBounds(label, bounds);
          if(transform.k < label.minZoom || !isInside) return;

          let className = "label";
          className += label.selectable ? " label--selectable" : "";
          label.minZoom = (label.minZoom === undefined) ? 0 : label.minZoom;

          return <span 
            key={i}
            className={className}
            onClick={this.handleClick.bind(this, label)}
            style={{
              /*transform: `translate(${label.x * transform.k}px, ${label.y * transform.k}px)`,*/
              left: `${label.x * transform.k}px`, 
              top:`${label.y * transform.k}px`
            }}>
            { label.value === "" ? "Unknown" : label.value }
          </span>
        })}
      </div>
    );
  }
}

export default SelectionUi;