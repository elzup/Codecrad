// @flow

module.exports = (input: string, opts: { postfix: ?string } = {}) => {
  if (typeof input !== 'string') {
    throw new TypeError(`Expected a string, got ${typeof input}`)
  }

  return `${input} & ${opts.postfix || 'rainbows'}`
}
