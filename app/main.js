var React = require('react');
var ReactDOM = require('react-dom');

var test_data = [{"original_url":"https://www.example.com/","short_url":"http://localhost:5000/GL4s", "key": "GL4s"}];

var UrlList = React.createClass({
  render: function() {
    var urlNodes = this.props.data.map(function(url) {
      return (
        <Url original_url={url.original_url} short_url={url.short_url} key={url.key} />
      );
    });
    return (
      <div className="url-list">
        {urlNodes}
      </div>
    );
  }
});

var Url = ({
  original_url,
  short_url
}) => {
  return (
    <div className="url">
      <div>Original URL: <a href={original_url}>{original_url}</a></div>
      <div>Short URL: <a href={short_url}>{short_url}</a></div>
    </div>
  )
}


ReactDOM.render(
  <UrlList data={test_data} />,
  document.getElementById('urls')
);