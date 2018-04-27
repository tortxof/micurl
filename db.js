const DynamoDB = require('aws-sdk/clients/dynamodb');

const db = new DynamoDB({ region: 'us-east-1', apiVersion: '2012-08-10' });

function getUrl(slug, callback) {
  db.getItem(
    {
      Key: {
        slug: { S: slug }
      },
      TableName: process.env.DYNAMODB_TABLE_NAME
    },
    function(err, data) {
      if (err) {
        callback(err, null);
      } else {
        if ('Item' in data) {
          callback(null, {
            slug: data.Item.slug.S,
            original_url: data.Item.url.S
          });
        } else {
          callback(null, null);
        }
      }
    }
  );
}

function putUrl(slug, url, callback) {
  db.putItem(
    {
      Item: {
        slug: { S: slug },
        url: { S: url }
      },
      TableName: process.env.DYNAMODB_TABLE_NAME,
      ConditionExpression: 'attribute_not_exists(slug)'
    },
    function(err, data) {
      if (data) {
        callback(null, {
          slug: slug,
          original_url: url
        });
      } else {
        callback(err, null);
      }
    }
  );
}

exports.getUrl = getUrl;
exports.putUrl = putUrl;
