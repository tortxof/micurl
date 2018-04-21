import React, { Component } from 'react';
import UrlForm from './UrlForm';
import UrlList from './UrlList';

class UrlContainer extends Component {
  constructor(props) {
    super(props);
    let urls = [];
    if (this.getLocalStorage()) {
      urls = this.getLocalStorage();
    }
    this.state = { urls: urls };
  }

  getLocalStorage() {
    return JSON.parse(localStorage.getItem('urls'));
  }

  setLocalStorage(urls) {
    localStorage.setItem('urls', JSON.stringify(urls));
  }

  handleUrlSubmit(originalUrl) {
    fetch(`${process.env.REACT_APP_URL}/new`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ url: originalUrl })
    }).then(response => {
      if (response.status === 200) {
        response.json().then(newUrl => {
          this.setState(
            prevState => ({
              urls: [
                { originalUrl: newUrl.original_url, shortUrl: newUrl.short_url }
              ].concat(prevState.urls)
            }),
            () => {
              this.setLocalStorage(this.state.urls);
            }
          );
        });
      } else {
        console.log('Failed to get short URL.');
      }
    });
  }

  render() {
    return (
      <div>
        <UrlForm onUrlSubmit={this.handleUrlSubmit} />
        <UrlList urls={this.state.urls} />
      </div>
    );
  }
}

export default UrlContainer;
