import React, { Component } from 'react';

class UrlForm extends Component {
  constructor(props) {
    super(props);
    this.state = { originalUrl: '' };
    this.handleOriginalUrlChange = this.handleOriginalUrlChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleOriginalUrlChange(e) {
    this.setState({ originalUrl: e.target.value });
  }

  handleSubmit(e) {
    e.preventDefault();
    const originalUrl = this.state.originalUrl.trim();
    if (!originalUrl) {
      return;
    }
    this.props.onUrlSubmit(originalUrl);
    this.setState({ originalUrl: '' });
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <div className="row">
          <label>
            Long URL
            <input
              className="u-full-width"
              type="url"
              placeholder="https://www.example.com/"
              value={this.state.originalUrl}
              onChange={this.handleOriginalUrlChange}
              autoFocus
            />
          </label>
        </div>
        <button className="button-primary" type="submit">
          Get Short URL
        </button>
      </form>
    );
  }
}

export default UrlForm;

