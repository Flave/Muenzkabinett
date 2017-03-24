import React from 'react';

class Stage2 extends React.Component {
  handleClick() {
    this.props.onNext && this.props.onNext();
  }

  render() {
    return (
      <div className="intro__item">
        No, just kiddin’
        <div onClick={this.handleClick.bind(this)} className="btn">
          Alright
        </div>
      </div>
    )
  }
}

export default Stage2;