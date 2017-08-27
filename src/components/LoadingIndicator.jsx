import React from 'react';

class Ui extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      backgroundPosition: {x: 0, y: 0}
    }
  }

  updatePosition() {

  }

  componentDidMount() {
    this.positionInterval = window.setInterval(() => {
      this.setState({backgroundPosition: {
        x: Math.floor(Math.random() * 6) * 160,
        y: Math.floor(Math.random() * 3) * 160
      }})
    }, 80);
  }

  componentWillUnmount() {
    window.clearInterval(this.positionInterval);
  }



  render() {
    var state = this.props.state,
        spinnerStyle = {
          "backgroundPosition": `${this.state.backgroundPosition.x}px ${this.state.backgroundPosition.y}px`
        },
        circleStyle = {
          strokeDasharray: Math.PI * 2 * 80,
          strokeDashoffset: Math.PI * 2 * 80 - Math.PI * 2 * 80 * state.coinsProgress,
          fill: "none",
          stroke: "#000"
        };

        //console.log(state.coinsProgress);

    return (
      <div className="loader">
        {/*<svg width="162" height="162" className="loader__indicator" version="1.1" xmlns="http://www.w3.org/2000/svg">
                  <circle style={circleStyle} cx="81" cy="81" r="80"/>
                </svg>*/}
        <span style={spinnerStyle} className="loader-spinner"></span>
      </div>
    );
  }
}

export default Ui;