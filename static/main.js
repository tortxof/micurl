var bGetShortUrl = document.getElementById('get_short_url');
var urlForm = document.getElementById('url_form');
var divUrls = document.getElementById('urls');

urlForm.addEventListener('submit', function(event) {
  event.preventDefault();

  var formData = new FormData(urlForm);
  var xhr = new XMLHttpRequest();

  xhr.addEventListener('load', function() {
    if (this.status === 200) {
      var newUrl = JSON.parse(this.response);
      divUrls.innerHTML += '<p>Original URL: ' +
        newUrl.original_url +
        '<br>Short URL: ' +
        newUrl.short_url +
        '</p>';
    }
  });

  xhr.open('POST', urlForm.action);
  xhr.send(formData);
});
