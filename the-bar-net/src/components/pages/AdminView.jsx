import React from 'react';
import '../styles.css';
import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';
import Login from './Login';
import UsuariosList from './UsuariosList';

export default function AdminView() {
    const active = "products";

    return (
        <div>
            <br />
            <Tabs justify defaultActiveKey={active} style={{ backgroundColor: 'white' }}>
                <Tab eventKey={active} title="Bebidas">
                    <Login />
                </Tab>
                <Tab eventKey="users" title="Usuarios">
                    <UsuariosList />
                </Tab>
                <Tab eventKey="bancos-tarjetas" title="Bancos y Tarjetas">
                    <Login />
                </Tab>
                <Tab eventKey="sucursal" title="Sucursal">
                    <Login />
                </Tab>
                <Tab eventKey="precios-envio" title="Precios de Envios">
                    <Login />
                </Tab>
            </Tabs>
        </div>
    )
}