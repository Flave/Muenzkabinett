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
    const spinnerStyle = {
      'backgroundPosition': `${this.state.backgroundPosition.x}px ${this.state.backgroundPosition.y}px`
    };

    return (
      <div className="loader">
        <span style={spinnerStyle} className="loader-spinner"></span>
      </div>
    );
  }
}

export default Ui;