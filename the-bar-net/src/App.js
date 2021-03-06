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
import AllProductos from './components/pages/AllProductos';
import { TheNetBar } from './components/context/TheNetBarContext';
import AdminView from './components/pages/views/AdminView';
import EmpleadoView from './components/pages/views/EmpleadoView';
import EncargadoView from './components/pages/views/EncargadoView';
import RepartidorView from './components/pages/views/RepartidorView';
import SignUp from './components/Forms/SignUp';
import Carrito from './components/pages/Carrito';
import { MisPedidos } from './components/pages/MisPedidos';
import FinalizarCompra from './components/pages/FinalizarCompra';
import Stocks from './components/pages/Stocks';
import { Footer } from './components/Footer';

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
        <Route path="/productos">
          <AllProductos />
        </Route>
        <Route path="/stocks">
          <Stocks />
        </Route>
        <Route path="/not-found">
          <NotFound />
        </Route>
        <Route path="*">
          <Redirect from="*" to="/not-found" />
        </Route>
      </Switch>
      <Footer />
    </div>
  );
}

export default App;
