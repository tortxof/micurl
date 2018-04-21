import React, { Component } from 'react';
import AboutContent from './AboutContent';

class AboutContainer extends Component {
  constructor(props) {
    super(props);
    this.state = { visible: false };
    this.handleToggle = this.handleToggle.bind(this);
  }

  handleToggle() {
    this.setState(prevState => ({
      visible: !prevState.visible
    }));
  }

  render() {
    return (
      <div className="about">
        <button onClick={this.handleToggle}>{'More info \u25BE'}</button>
        {this.state.visible ? <AboutContent appUrl={this.appUrl} /> : null}
      </div>
    );
  }
}

export default AboutContainer;
