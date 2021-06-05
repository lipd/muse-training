import { Playground } from '@screens/playground'
import { Reading } from '@screens/reading'
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom'
import './app.scss'

function App() {
  return (
    <Router>
      <div className="app">
        <Switch>
          <Route path="/reading">
            <Reading />
          </Route>
          <Route path="/">
            <Playground />
          </Route>
        </Switch>
      </div>
    </Router>
  )
}

export default App
