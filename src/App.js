import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import { Provider } from 'react-redux'
import store from './store'
import Login from './pages/login'
import Admin from './pages/admin'

function App() {
  return (
    <div className="App">
      <Provider store={store}>
        <Router>
          <Switch>
            <Route path='/login' exact component={Login} />
            <Route path='/' component={Admin} />
          </Switch>
        </Router>
      </Provider>
    </div>
  );
}

export default App;
