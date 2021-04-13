import React from 'react';
import './App.css';
import { Redirect, Route, Switch } from 'react-router-dom';
import Home from './components/pages/Home';
import NotFound from './components/pages/NotFound';

function App() {

  return (
    <div className="App">
      <Switch>
        <Route exact path="/">
          <Redirect from="/" to="/home" />
        </Route>
        <Route path="/home">
          <Home />
        </Route>
        <Route path="/not-found">
          <NotFound />
        </Route>
        <Route path="*">
          <Redirect from="*" to="/not-found" />
        </Route>
      </Switch>
    </div>
  );
}

export default App;
