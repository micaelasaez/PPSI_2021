import React from 'react';
import './App.css';
import { Redirect, Route, Switch } from 'react-router-dom';
import Home from './components/pages/Home';
import Combos from './components/pages/Combos';
import Ofertas from './components/pages/Ofertas';
import NotFound from './components/pages/NotFound';
import Login from './components/pages/Login';
import { Header } from './components/Header';
import ShowProductos from './components/pages/ShowProductos';
import SignUp from './components/pages/SignUp';
import { TheNetBar } from './components/context/TheNetBarContext';
import AdminView from './components/pages/AdminView';

function App() {

  return (
    <div className="App">
      <TheNetBar.Consumer>
        {
          ({ user, isLogged, carritoTotal, setIsLogged }) => (
            <Header carritoTotal={carritoTotal} isLogged={isLogged} type={user} setIsLogged={setIsLogged}/>
          )}
      </TheNetBar.Consumer>
      <Switch>
        <Route exact path="/">
          <Redirect from="/" to="/home" />
        </Route>
        <Route path="/login">
          <Login />
        </Route>
        <Route path="/sign-up">
          <SignUp />
        </Route>
        {/* <Route path="/new-product">
        </Route> */}
        <Route path="/home">
          <Home />
        </Route>
        <Route path="/home-admin">
          <AdminView />
        </Route>
        <Route path="/combos">
          <Combos />
        </Route>
        <Route path="/ofertas">
          <Ofertas />
        </Route>
        <Route path="/show-productos">
          <ShowProductos />
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
