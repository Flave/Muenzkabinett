import React from 'react';
import stateStore from 'app/stateStore';
import stages from 'app/components/intro/index.js';

class IntroController extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      stage: 0
    }
  }

  componentDidMount() {

  }

  componentDidUpdate() {

  }

  createStageZero() {

  }

  createStageOne() {

  }

  handleNext() {
    var stage = this.state.stage;
    var nextStage = stage + 1;

    if(nextStage === stages.length) {
      stateStore.set({onboardingComplete: true});
      return;
    }

    this.setState({stage: nextStage});
    if(nextStage === 2)
      stateStore.set({showUi: true});
  }

  render() {
    var state = this.props.state;
    var Stage = stages[this.state.stage];

    return (
      <div className="intro">
        {state.canvasInitialized && <Stage onNext={this.handleNext.bind(this)} />}
      </div>
    );
  }
}

export default IntroController;