#!/usr/bin/env node
import * as meow from 'meow'
import codecrad from '.'

const cli = meow(`
	Usage
	  $ codecrad

	Options
	  --foo  Lorem ipsum [Default: false]

	Examples
	  $ codecrad
	  // TODO: play start
`)

codecrad()
