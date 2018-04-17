import React, { Component } from 'react';
import AboutContainer from './AboutContainer';
import UrlContainer from './UrlContainer';

class App extends Component {
  render() {
    return (
      <div className="App">
        <AboutContainer />
        <UrlContainer />
      </div>
    );
  }
}

export default App;
