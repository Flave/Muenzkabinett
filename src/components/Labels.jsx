import React from 'react';

class SelectionUi extends React.Component {
  componentDidUpdate() {
    //console.dir(this.root);
  }

  render() {
    var {labels, transform} = this.props;
    if(!labels || !labels.length) return <div/>;

    return (
      <div ref={(root) => this.root = root} className="labels">
        {labels.map((label, i) => {
          let className = "label";
          className += label.selectable ? " label--selectable" : "";
          label.minZoom = (label.minZoom === undefined) ? 0 : label.minZoom;

          return <span 
            key={i}
            className={className}
            onClick={() => this.props.onLabelClick(label)}
            style={{
              position: "absolute",
              left: `${label.x * transform.k}px`, 
              top:`${label.y * transform.k}px`,
              opacity: transform.k > label.minZoom ? 1 : 0
            }}>
            {label.value}
          </span>
        })}
      </div>
    );
  }
}

export default SelectionUi;