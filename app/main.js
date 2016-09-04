require('./main.sass')

const React = require('react')
const ReactDOM = require('react-dom')

const AboutContainer = React.createClass({
  appUrl: document.getElementById('urls').dataset.appUrl,
  getInitialState: function() {
    return {visible: false}
  },
  handleToggle: function() {
    this.setState({visible: !this.state.visible})
  },
  render: function() {
    return (
      <div className="about">
        <button onClick={this.handleToggle}>{'More info \u25BE'}</button>
        {this.state.visible ? <AboutContent appUrl={this.appUrl} /> : null}
      </div>
    )
  }
})

const AboutContent = ({appUrl}) => {
  return (
    <div>
      <p>
        URLs can be submitted as a <code>GET</code> or <code>POST</code> request.
        <code>POST</code> content type can be
        <code>application/x-www-form-urlencoded</code> (vanilla form),
        <code>multipart/form-data</code> (FormData API),
        or <code>applicatin/json</code>.
      </p>
      <p>Here are some example requests.</p>
      <ul>
        <li>
          <code>{appUrl}/new?url=https://www.example.com/</code>
        </li>
        <li>
          <code>{`curl -H 'Content-Type: application/json' -X POST -d '{"url": "https://www.example.com/"}' ` + appUrl + `/new`}</code>
        </li>
        <li>
          <pre><code>
            {`<form action="` + appUrl + `/new" method="post">\n  <input type="url" name="url" />\n  <button type="submit">Get Short URL</button>\n</form>`}
          </code></pre>
        </li>
      </ul>
      <p>And an example response.</p>
      <code>{`{"original_url":"https://www.example.com/","short_url":"` + appUrl + `/fz58"}`}</code>
    </div>
  )
}

const UrlContainer = React.createClass({
  getInitialState: function() {
    return {urls: []}
  },
  handleUrlSubmit: function(originalUrl) {
    const formData = new FormData()
    const xhr = new XMLHttpRequest()
    formData.append('url', originalUrl)
    const urlContainer = this
    xhr.addEventListener('load', function() {
      if (this.status === 200) {
        const newUrl = JSON.parse(this.response)
        if (urlContainer.isMounted()) {
          urlContainer.setState({
            urls: [
              {originalUrl: newUrl.original_url, shortUrl: newUrl.short_url}
            ].concat(urlContainer.state.urls)
          })
        }
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
    this.props.onUrlSubmit(originalUrl)
    this.setState({originalUrl: ''})
  },
  render: function() {
    return (
      <form onSubmit={this.handleSubmit}>
        <div className='row'>
          <label>
            Long URL
            <input
              className='u-full-width'
              type='url'
              placeholder='https://www.example.com/'
              value={this.state.originalUrl}
              onChange={this.handleOriginalUrlChange}
              autoFocus
            />
          </label>
        </div>
        <button className='button-primary' type='submit'>Get Short URL</button>
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
      <div>
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
  (
    <div>
      <AboutContainer />
      <UrlContainer />
    </div>
  ),
  document.getElementById('urls')
)
