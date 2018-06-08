# Karma-Node-App

## Install
Run `yarn add @karmalicious/node-app`.

## Setup
Copy the `.env.example` and fill out the values.

### Empty tokens
Put `__NONE__` as a value if you want to explicitly document that you are skipping a value.

## Development

## Testing

### Jest
Run `yarn test`.
Run `yarn test -- --watch` for watch mode.

### Postman
Set `Content-Type: application/json` in the header.
Send a *raw* body in JSON format. `form-data` and others will probably fail as intended.
You can start with the `GET /alive` to see if the server is up.

## Code overview
Listed below are the main folders that make up this repository.
Each folder should have its own `README.md` explaining the details of the code.

### Provider
The core of the application. It will create a `configuration`, the `service-effects`, and return the `serverListen` function for running the server.

### Service-effects
Each service effect will execute an effectful command like a DB query, HTTP call, or pub/sub a rabbitMQ event.

### Tools
A shared set of utilities to use in the components.

### Components
A component describes different entities.
They are coded as pure functions. We inject all effectful code from the outside via the `provider`'s `service-effects`.
All `components` should conform to the same public component API.
