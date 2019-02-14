# Codecrad

[![Build Status](https://travis-ci.org/elzup/codecrad.svg?branch=master)](https://travis-ci.org/elzup/codecrad)
[![tested with jest](https://img.shields.io/badge/tested_with-jest-99424f.svg)](https://github.com/facebook/jest)
[![styled with prettier](https://img.shields.io/badge/styled_with-prettier-ff69b4.svg)](https://github.com/prettier/prettier)

> Coding game RTA

コーディング速度を競うゲームです。

一人用タイムアタックゲーム(タイピングゲームのイメージ)。
cli で起動したら diff が指定されて各自好きなエディタでコーディングする。
チェッカーが差分監視して Time をだす。

### 推奨環境

- prettier: fix on Save
- node: >=8
- Terminal: 40 line

## Let's Play!

```
npx codecrad
```

## development

- node
- typescript

## Install

```
$ npm install codecrad
```

## Usage

```js
const codecrad = require('codecrad')

codecrad('unicorns')
//=> 'unicorns & rainbows'
```

## API

### `codecrad(input, [options])`

#### input

Type: `string`

Lorem ipsum.

#### options

##### foo

Type: `boolean`<br>
Default: `false`

Lorem ipsum.

## CLI

```
$ npm install --global codecrad
```

```
$ codecrad --help

  Usage
    codecrad [input]

  Options
    --foo  Lorem ipsum [Default: false]

  Examples
    $ codecrad
    unicorns & rainbows
    $ codecrad ponies
    ponies & rainbows
```

## License

MIT © [elzup](http://elzup.com)

## Contributors

Thanks goes to these wonderful people ([emoji key](https://github.com/kentcdodds/all-contributors#emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore -->
| [<img src="https://avatars3.githubusercontent.com/u/2284908?v=4" width="100px;"/><br /><sub><b>elzup</b></sub>](https://elzup.com)<br />[💻](https://github.com/elzup/generator-nm/commits?author=elzup "Code") [📖](https://github.com/elzup/generator-nm/commits?author=elzup "Documentation") [⚠️](https://github.com/elzup/generator-nm/commits?author=elzup "Tests") [🚇](#infra-elzup "Infrastructure (Hosting, Build-Tools, etc)") |
| :---: |

<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/kentcdodds/all-contributors) specification. Contributions of any kind welcome!
