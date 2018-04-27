import React, { Component } from 'react';
import AboutContainer from './AboutContainer';
import UrlContainer from './UrlContainer';

class App extends Component {
  render() {
    return (
      <div className="container">
        <h1>{process.env.REACT_APP_NAME}</h1>
        <h3>a url shortener</h3>
        <div className="App">
          <AboutContainer />
          <UrlContainer />
        </div>
      </div>
    );
  }
}

export default App;
