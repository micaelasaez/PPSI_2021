import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { TheBarNetServerUrl } from './Url';

const TheNetBarContext = React.createContext({
    user: {},
    pedido: {},
    isLogged: null,
    carritoTotal: 0,
    productosCarrito: [],
    token: '',
    setIsLogged: () => { },
    addCarrito: () => { },
    setCarrito: () => { },
    setCarritoTotal: () => { },
    setUser: () => { },
    setPedido: () => { }
});

/* ejemplo productoCarrito = {
    p: {
        StockMax: 53
        cantidad: " 473 ml"
        fechaVencimiento: ""
        fotos: "https://statics.dinoonline.com.ar/imagenes/full_600x600_ma/3100659_f.jpg"
        nombre: "Pack Cerveza Patagonia Weisse"
        precio: 700
        stockActual: 42
        stockMin: 30
    },
    cantidad: 1
} */

class TheNetBarProvider extends Component {
    state = {
        user: {},
        pedido: {},
        isLogged: null,
        carritoTotal: 0,
        productosCarrito: [],
        token: ''
    };

    componentDidMount() {
        if (localStorage.getItem('token') !== null) {
            let productosCarrito = [];
            let carritoTotal = 0;
            let user = {};
            const token = localStorage.getItem('token');
            
            if (localStorage.getItem('carrito') !== null) {
                productosCarrito = JSON.parse(localStorage.getItem('carrito'));
                productosCarrito.forEach(e => {
                    carritoTotal += (e.cantidad * e.p.precio);
                });
            }

            fetch(TheBarNetServerUrl.verifyToken, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                mode: 'cors', // no-cors
                body: JSON.stringify({
                    token: token
                })
            }).then(res => res.json())
                .then(response => {
                    user = response.rta;
                })
                .finally(() => {
                    console.log('loggued user', user);
                    this.setState({ ...this.state, isLogged: true, productosCarrito, carritoTotal, token, user });
                });
        } else {
            localStorage.clear();
        }
    }

    // funcs
    // ej 
    // getUserProfile = async () => {
    //func
    // this.setState({
    //     //obj
    // }, 
    //     // callback
    // )
    // }

    setUser = (user) => this.setState({ ...this.state, user });
    setToken = (token) => this.setState({ ...this.state, token });
    setPedido = (pedido) => this.setState({ ...this.state, pedido });

    setIsLogged = (isLogged, token, user) => {
        if (isLogged) {
            localStorage.setItem('token', token);
            this.setState({ ...this.state, isLogged, token: token, user });
        } else {
            localStorage.removeItem('token');
            localStorage.removeItem('carrito');
            // localStorage.clear();
            this.setState({ ...this.state, isLogged: null, carritoTotal: 0, productosCarrito: [], token: '' });
        }
    }

    setCarrito = (productosCarrito, carritoTotal) => this.setState({
        ...this.state,
        productosCarrito,
        carritoTotal
    }, () => {
        if (this.state.productosCarrito.length > 0) {
            localStorage.setItem('carrito', JSON.stringify(this.state.productosCarrito));
        } else {
            localStorage.removeItem('carrito');
        }
    });

    setCarritoTotal = (newTotal) => this.setState({ ...this.state, carritoTotal: newTotal });

    addCarrito = (product, cantidad) => {
        const productoCarritoNew = { p: product, cantidad: cantidad };
        const newPrecio = Number.parseInt(product.precio) * cantidad;

        const productos = this.state.productosCarrito;
        const elementIndex = this.state.productosCarrito.findIndex(element => element.p.nombre === product.nombre);
        if (elementIndex !== -1) {
            let item = { ...productos[elementIndex] };
            item.cantidad += cantidad;
            productos[elementIndex] = item;
        } else {
            productos.push(productoCarritoNew);
        }

        this.setState({
            ...this.state,
            carritoTotal: (this.state.carritoTotal + newPrecio),
            productosCarrito: productos
        },
            () => localStorage.setItem('carrito', JSON.stringify(this.state.productosCarrito))
        );
    }

    render() {
        return (
            <TheNetBarContext.Provider
                value={{
                    ...this.state,
                    setIsLogged: this.setIsLogged,
                    addCarrito: this.addCarrito,
                    setCarrito: this.setCarrito,
                    setCarritoTotal: this.setCarritoTotal,
                    setUser: this.setUser,
                    setPedido: this.setPedido
                }}
            >
                {this.props.children}
            </TheNetBarContext.Provider>
        )
    }
}


export const TheNetBar = {
    Consumer: TheNetBarContext.Consumer,
    Provider: TheNetBarProvider,
    Context: TheNetBarContext
}