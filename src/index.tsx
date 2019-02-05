import { h, render } from 'ink'
import App from './components/App'
import { stages } from './config'

export default async () => {
  render(<App stage={stages.fizzbuzz} />)
}
