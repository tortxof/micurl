import React from 'react';

const Url = ({ originalUrl, shortUrl }) => {
  return (
    <div className="url">
      <div>
        Original URL: <a href={originalUrl}>{originalUrl}</a>
      </div>
      <div>
        Short URL: <a href={shortUrl}>{shortUrl}</a>
      </div>
    </div>
  );
};

export default Url;
