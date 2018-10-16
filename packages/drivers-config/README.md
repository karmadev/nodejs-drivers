# drivers-config

A simple environment variable handler so you don't have to access `process.env.NS_FOO` directly.

## Install
`npm install @karmalicious/drivers-config`

## Features
* Removes env vars that are  `undefined`. This simplifies the type signature.
* Remove env var namespaces so `NS_FOO="hello"` is accessed via `config.FOO`.
* Filter out any value that does not start with the namespace. This makes it easier to debug and test the env vars.
* Strip out the namespace from the config variables. This is key to send the config around to the drivers libraries.
