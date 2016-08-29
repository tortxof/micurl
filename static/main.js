var bGetShortUrl = document.getElementById('get_short_url');
var urlForm = document.getElementById('url_form');
var divUrls = document.getElementById('urls');

function makeLink(url) {
  return '<a href="' + url + '">' + url + '</a>';
}

urlForm.addEventListener('submit', function(event) {
  event.preventDefault();

  var formData = new FormData(urlForm);
  var xhr = new XMLHttpRequest();

  xhr.addEventListener('load', function() {
    if (this.status === 200) {
      var newUrl = JSON.parse(this.response);
      divUrls.innerHTML += '<p>Original URL: ' +
        makeLink(newUrl.original_url) +
        '<br>Short URL: ' +
        makeLink(newUrl.short_url) +
        '</p>';
    }
  });

  xhr.open('POST', urlForm.action);
  xhr.send(formData);
});
