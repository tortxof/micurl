var React = require('react')
var ReactDOM = require('react-dom')

const test_data = {"originalUrl":"https://www.example.com/","shortUrl":"http://localhost:5000/GL4s"}

const UrlContainer = React.createClass({
  getInitialState: function() {
    return {urls: []}
  },
  handleUrlSubmit: function(url) {
    console.log('UrlContainer handleUrlSubmit url', url)
    this.setState({
      urls: this.state.urls.concat([{originalUrl: url.originalUrl, shortUrl: test_data.shortUrl}])
    })
    console.log('UrlContainer handleUrlSubmit this.state.urls', this.state.urls)
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
    console.log('submit handler')
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

var UrlList = React.createClass({
  render: function() {
    console.log('UrlList render func this.props.urls', this.props.urls)
    var urlNodes = this.props.urls.map(url => (<Url originalUrl={url.originalUrl} shortUrl={url.shortUrl} />))
    return (
      <div className="url-list">
        {urlNodes}
      </div>
    )
  }
})

var Url = ({
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
