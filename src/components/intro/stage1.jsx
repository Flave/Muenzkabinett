import React from 'react';

class Stage1 extends React.Component {
  handleClick() {
    this.props.onNext && this.props.onNext();
  }

  render() {
    return (
      <div className="intro__item">
        What are you waiting for?
        <div onClick={this.handleClick.bind(this)} className="btn">
          Alright
        </div>
      </div>
    )
  }
}

export default Stage1;