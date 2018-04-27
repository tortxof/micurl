import React, { Component } from 'react';
import Url from './Url';

class UrlList extends Component {
  render() {
    const urlNodes = this.props.urls.map(url => (
      <Url
        originalUrl={url.originalUrl}
        shortUrl={url.shortUrl}
        key={url.shortUrl}
      />
    ));
    return <div>{urlNodes}</div>;
  }
}

export default UrlList;
