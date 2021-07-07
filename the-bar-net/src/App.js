import React from 'react';
import './App.css';
import { Redirect, Route, Switch } from 'react-router-dom';
import Home from './components/pages/Home';
import Combos from './components/pages/Combos';
import { Ofertas } from './components/pages/Ofertas';
import NotFound from './components/pages/NotFound';
import Login from './components/pages/Login';
import { Header } from './components/Header';
import ShowProductos from './components/pages/ShowProductos';
import { TheNetBar } from './components/context/TheNetBarContext';
import AdminView from './components/pages/AdminView';
import EmpleadoView from './components/pages/EmpleadoView';
import EncargadoView from './components/pages/EncargadoView';
import RepartidorView from './components/pages/RepartidorView';
import SignUp from './components/Forms/SignUp';
import Carrito from './components/pages/Carrito';
import { MisPedidos } from './components/pages/MisPedidos';
import FinalizarCompra from './components/pages/FinalizarCompra';

function App() {

  return (
    <div className="App">
      <TheNetBar.Consumer>
        {
          ({ user, isLogged, carritoTotal, setIsLogged }) => (
            <Header carritoTotal={carritoTotal} isLogged={isLogged} user={user} setIsLogged={setIsLogged} />
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
        <Route path="/mis-pedidos">
          <MisPedidos />
        </Route>
        {/* <Route path="/new-product">
        </Route> */}
        <Route path="/home">
          <Home />
        </Route>
        <Route path="/home-admin">
          <AdminView />
        </Route>
        <Route path="/home-encargado">
          <EncargadoView />
        </Route>
        <Route path="/home-empleado">
          <EmpleadoView />
        </Route>
        <Route path="/home-repartidor">
          <RepartidorView />
        </Route>
        <Route path="/carrito">
          <Carrito />
        </Route>
        <Route path="/finalizar-compra">
          <FinalizarCompra />
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
