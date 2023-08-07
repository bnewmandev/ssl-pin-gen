[![npm version](https://badge.fury.io/js/ssl-pin-gen.svg)](https://badge.fury.io/js/ssl-pin-gen)
# ssl-pin-gen

> A cli tool and api to generate SSL certificate pins for mobile app pinning

## Reasoning
The idea was to create a simple cli tool for generating SSL public key pins that doesn't rely on openssl.

## Prerequisites
This project requires NodeJS (version 16 or later)

## Install

Local installation
```sh
npm install --global ssl-pin-gen
```
or
```sh
yarn global add ssl-pin-gen
```

## Usage

To get started with the cli run:
```sh
npx ssl-pin-gen@latest --help
```

In order to add preset domain(s) pass in an environment variable `DOMAIN_OPTIONS` with the value being a comma seperated list of domains e.g:
```
DOMAIN_OPTIONS="www.google.com,github.com"
```

## Licence
[ISC](LICENCE.md)
