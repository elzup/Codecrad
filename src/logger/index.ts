import { appendFileSync, existsSync } from 'fs'
import { createFileSync } from 'fs-extra'

const LOG_FILE = 'log/log.txt'

export const log = (text: string) => {
  if (!existsSync(LOG_FILE)) {
    createFileSync(LOG_FILE)
  }
  appendFileSync(LOG_FILE, text + '\n')
}
