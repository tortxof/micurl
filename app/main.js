const React = require('react')
const ReactDOM = require('react-dom')

const UrlContainer = React.createClass({
  getInitialState: function() {
    return {urls: []}
  },
  handleUrlSubmit: function(url) {
    const formData = new FormData()
    const xhr = new XMLHttpRequest()
    formData.append('url', url.originalUrl)
    const urlContainerThis = this
    xhr.addEventListener('load', function() {
      if (this.status === 200) {
        const newUrl = JSON.parse(this.response)
        urlContainerThis.setState({
          urls: urlContainerThis.state.urls.concat([
            {
              originalUrl: newUrl.original_url,
              shortUrl: newUrl.short_url
            }
          ])
        })
      }
    })
    xhr.open('POST', '/new/');
    xhr.send(formData);
  },
  render: function() {
    return (
      <div>
        <UrlForm onUrlSubmit={this.handleUrlSubmit} />
        <UrlList urls={this.state.urls} />
      </div>
    )
  }
})

const UrlForm = React.createClass({
  getInitialState: function() {
    return {originalUrl: ''}
  },
  handleOriginalUrlChange: function(e) {
    this.setState({originalUrl: e.target.value})
  },
  handleSubmit: function(e) {
    e.preventDefault()
    const originalUrl = this.state.originalUrl.trim()
    if (!originalUrl) {
      return
    }
    this.props.onUrlSubmit({originalUrl: originalUrl})
    this.setState({originalUrl: ''})
  },
  render: function() {
    return (
      <form onSubmit={this.handleSubmit}>
        <input
          type='url'
          placeholder='https://www.example.com/'
          value={this.state.originalUrl}
          onChange={this.handleOriginalUrlChange}
        />
        <button type='submit'>Get Short URL</button>
      </form>
    )
  }
})

const UrlList = React.createClass({
  render: function() {
    const urlNodes = this.props.urls.map(
      url => (<Url originalUrl={url.originalUrl} shortUrl={url.shortUrl} />)
    )
    return (
      <div className="url-list">
        {urlNodes}
      </div>
    )
  }
})

const Url = ({
  originalUrl,
  shortUrl
}) => {
  return (
    <div className="url">
      <div>Original URL: <a href={originalUrl}>{originalUrl}</a></div>
      <div>Short URL: <a href={shortUrl}>{shortUrl}</a></div>
    </div>
  )
}


ReactDOM.render(
  <UrlContainer />,
  document.getElementById('urls')
)
