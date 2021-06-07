import { Interval } from '@screens/interval'
import { Playground } from '@screens/playground'
import { Reading } from '@screens/reading'
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom'
import './app.scss'

function App() {
  return (
    <Router>
      <div className="app">
        <div>
          <div className="link-group">
            <Link className="link" to="/">
              自由练习
            </Link>
            <Link className="link" to="/reading">
              识谱练习
            </Link>
            <Link className="link" to="/interval">
              音程听辨
            </Link>
            <Link className="link" to="/">
              视唱音准
            </Link>
          </div>
          <Switch>
            <Route path="/interval">
              <Interval />
            </Route>
            <Route path="/reading">
              <Reading />
            </Route>
            <Route path="/">
              <Playground />
            </Route>
          </Switch>
        </div>
      </div>
    </Router>
  )
}

export default App
