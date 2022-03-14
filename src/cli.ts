// import meow from 'meow'
import codecrad from '.'
import { log } from './logger'

// meow(`
// 	Usage
// 	  $ codecrad

// 	Options
// 	  --foo  Lorem ipsum [Default: false]

// 	Examples
// 	  $ codecrad
// 	  // TODO: play start
// `)
const [_1, _2, key = 'fizzbuzz'] = process.argv

log(`start: ${key}`)

codecrad(key)

export {}
