import * as meow from 'meow'
import codecrad from '.'

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

codecrad()
