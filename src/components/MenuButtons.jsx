import React from 'react';
import stateStore from 'app/stateStore';

class Info extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showHint: false
    }
    this.handleNopeClick = this.handleNopeClick.bind(this);
  }
  componentDidMount() {
    setTimeout(() => {
      this.setState({showHint: true});
    }, 120000)
  }
  handleNopeClick() {
    this.setState({showHint: false});
  }
  render() {
    return (
      <div className="menu__buttons">
        <span className={`hint hint--survey ${this.state.showHint ? '' : ' is-hidden'}`}>
          <div className="hint__title">Survey</div>
          <div className="hint__copy">This project is part of a research project on the visualisation of cultural collections. Would you like to help us and answer two quick questions?</div>
          <div className="hint__footer">
            <span target="_blank" className="btn btn--inverted">
              <a target="_blank" href="https://goo.gl/forms/9TKRioKC3eVs7upv1">Sure</a>
            </span>
            <span onClick={this.handleNopeClick} className="btn btn--dark">Nope</span>
          </div>
        </span>
        <span onClick={this.props.onInfoClick} className="menu__button">Info</span>
        <a href="https://goo.gl/forms/9TKRioKC3eVs7upv1" target="_blank" className="menu__button">Survey</a>
      </div>
    );
  }
}

export default Info;