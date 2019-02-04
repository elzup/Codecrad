#!/usr/bin/env node
'use strict'
const meow = require('meow')
const codecrad = require('.')

const cli = meow(`
	Usage
	  $ codecrad [input]

	Options
	  --foo  Lorem ipsum [Default: false]

	Examples
	  $ codecrad
	  unicorns & rainbows
	  $ codecrad ponies
	  ponies & rainbows
`)

console.log(codecrad(cli.input[0] || 'unicorns'))
