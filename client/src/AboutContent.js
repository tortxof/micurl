import React from 'react';

const AboutContent = ({ appUrl }) => {
  return (
    <div>
      <p>
        URLs can be submitted as a <code>GET</code> or <code>POST</code>{' '}
        request. <code>POST</code> content type can be{' '}
        <code>application/x-www-form-urlencoded</code> (vanilla form),{' '}
        <code>multipart/form-data</code> (FormData API), or{' '}
        <code>applicatin/json</code>.
      </p>
      <p>Here are some example requests.</p>
      <ul>
        <li>
          <code>{`${appUrl}/new?url=https://www.example.com/`}</code>
        </li>
        <li>
          <code>
            {`curl -H 'Content-Type: application/json' -X POST`}
            {` -d '{"url": "https://www.example.com/"}' ${appUrl}/new`}
          </code>
        </li>
        <li>
          <pre>
            <code>
              {`<form action="${appUrl}/new" method="post">\n`}
              {`  <input type="url" name="url" />\n`}
              {`  <button type="submit">Get Short URL</button>\n`}
              {`</form>`}
            </code>
          </pre>
        </li>
      </ul>
      <p>And an example response.</p>
      <p>
        <code>
          {`{"original_url": "https://www.example.com/",`}
          {` "short_url": "${appUrl}/fz58"}`}
        </code>
      </p>
      <p>
        View this project on{' '}
        <a href="https://github.com/tortxof/micurl">GitHub</a>.
      </p>
    </div>
  );
};

export default AboutContent;
