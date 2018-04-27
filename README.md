# micurl

## Building the client

The front-end client is a React app using create-react-app. It resides in the
`client` directory. Before building create the file `client/.env` and set the
variables `REACT_APP_NAME` and `REACT_APP_URL`.

Example `.env`

```
REACT_APP_NAME=itsy.ml
REACT_APP_URL=https://itsy.ml
```

To build the client run `yarn install` followed by `yarn build`.

## Deploying to Lambda

From the root of the project, run the following:

```
claudia update --set-env APP_URL=https://itsy.ml,DYNAMODB_TABLE_NAME=micurl
```
