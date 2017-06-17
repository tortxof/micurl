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
      <p>
        <code>{`{"original_url":"https://www.example.com/","short_url":"` + appUrl + `/fz58"}`}</code>
      </p>
      <p>View this project on <a href="https://github.com/tortxof/micurl">GitHub</a>.</p>
    </div>
  )
}

const UrlContainer = React.createClass({
  getInitialState: function() {
    let urls = []
    if (this.getLocalStorage()) {
      urls = this.getLocalStorage()
    }
    return {urls: urls}
  },
  getLocalStorage() {
    return JSON.parse(localStorage.getItem("urls"))
  },
  setLocalStorage(urls) {
    localStorage.setItem(
      "urls",
      JSON.stringify(urls)
    )
  },
  handleUrlSubmit: function(originalUrl) {
    fetch('/new', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({url: originalUrl})
    })
    .then(response => {
      if (response.status === 200) {
        response.json().then(newUrl => {
          this.setState({
            urls: [
              {originalUrl: newUrl.original_url, shortUrl: newUrl.short_url}
            ].concat(this.state.urls)
          })
          this.setLocalStorage(this.state.urls)
        })
      } else {
        console.log('Failed to get short URL.')
      }
    })
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
      url => (<Url originalUrl={url.originalUrl} shortUrl={url.shortUrl} key={url.shortUrl} />)
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
