declare module 'strip-ansi'
declare module 'events'

declare module 'ink-testing-library' {
  function render(
    e: JSX.Element | null
  ): {
    lastFrame(): string
    unmount(): void
  }
}
