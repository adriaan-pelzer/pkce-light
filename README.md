# pkce-light
A lightweight pkce, depending only on core modules

## Installation

```
  npm install pkce-light
```
or
```
  yarn add pkce-light
```

## Usage

```js
  const { code_challenge, code_verifier, verify } = require('pkce-light');
  const { code_challenge, code_verifier } = generate();
  verify({ code_challenge, code_verifier }); // true
```
