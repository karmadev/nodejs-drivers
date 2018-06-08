# Config

## Parameters

### prefix
All environment variables except NODE_ENV should be prefixed by some unique string.
This allows us to filter out not needed environment variables from the config object.
Example prefix: "KSALO_" or "MYAPP_".

### removeToken
Will remove key/val pairs where the val === removeToken (usually `'__NONE__'`).
This is to be explicit about what values we don't want to use in our code instead of using empty strings,
which might actually be a value we want to use, and not remove.

## Returns
A config object with all the keys starting with the `prefix`, excluding the ones with a `removeToken`.
