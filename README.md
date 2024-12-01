# coros-connect

Library to interact with COROS Api.

⚠️ This repository is using a **non-public API** from [COROS Training Hub](https://t.coros.com/) that could break
anytime.

This project is inspired by:
- [https://github.com/Pythe1337N/garmin-connect](https://github.com/Pythe1337N/garmin-connect)
- [https://github.com/xballoy/coros-api](https://github.com/xballoy/coros-api)

## Instalation

`npm install coros-connect`

## Usage

You can setup a configuration file on your project root called `coros.config.json` containing your email and password.

```json
{
    "email": "my.email@example.com",
    "password": "MySecretPassword"
}
```

Or you can provide on the constructor or `login` command.

```js
const coros = new CorosApi({
    email: "my.email@example.com",
    password: "MySecretPassword"
});

await coros.login("my.email@example.com","MySecretPassword");
```

## Functionality

This library only supports the following:

- Login on Coros and get an access token.
- Get list of activities.
- Get activity detail (and other data used on the Coros page for the activity).
- Download an activity file.

## Example

You can find one example on [here](./example/index.ts)

## Licence

[MIT License](LICENSE.md)