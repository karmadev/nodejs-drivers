# nodejs-drivers

A set of common dependencies needed to get started with a nodejs-server.

This project encourages a modularized/co-located file structure so it's easier to split a service up in smaller chunks in the future.

It has the following set of highly opinionated drivers:

* db: A database driver for postgresql.
* httpReq: Make HTTP requests to other servers.
* jwt: Just a re-export of jsonwebtoken.
* logger: Logging based on Winston.
* pubSub: Google Cloud Platform's Pub-Sub message broker for sending events between services.
* report: Generate PDF reports. This is optional, and not included in the standard serverDeps set. Import it directly instead.
* server: Wraps Express with some defaults, and exposes `initRoutes` that mounts routes, extracts variables, and calls model methods with those variables.
* uuid: Generates v4 uuids.

## Install
Run `yarn add @karmalicious/nodejs-drivers`.

## Setup
Copy the `.env.example` and fill out the values.
`GOOGLE_APPLICATION_CREDENTIALS` need to be set according to https://cloud.google.com/docs/authentication/production in the section "Creating a service account". Alternatively, go to https://console.cloud.google.com/apis/credentials/serviceaccountkey and download the JSON in to the root of the project and set `GOOGLE_APPLICATION_CREDENTIALS=./gcp-service-account.json` in the .env file.

## Testing

Run `yarn test`.
Run `yarn test -- --watch` for watch mode.

## Publishing

* Run `yarn publish` and set a new semver number.
* Run `git push && git push --tags`.
