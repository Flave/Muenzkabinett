import React from 'react';

class Stage0 extends React.Component {
  handleClick() {
    this.props.onNext && this.props.onNext();
  }

  render() {
    return (
      <div className="intro__item">
        What a mess!
        <div onClick={this.handleClick.bind(this)} className="btn">
          Let's start the cleanup
        </div>
      </div>
    )
  }
}

export default Stage0;