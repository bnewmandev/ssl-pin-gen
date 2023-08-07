# ssl-pin-gen

> A cli tool and library to generate SSL certificate pins for mobile app pinning

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
npx ssl-pin-gen --help
```

In order to add preset domain(s) pass in an environment variable `DOMAIN_OPTIONS` with the value being a comma seperated list of domains e.g:
```
DOMAIN_OPTIONS="www.google.com,github.com"
```
