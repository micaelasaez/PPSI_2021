import React from 'react';
import '../styles.css';
import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';
import Login from './Login';

export default function UsuariosList() {
    const active = "encargados";

    return (
        <div>
            <br />
            <Tabs justify defaultActiveKey={active} style={{ backgroundColor: 'white' }}>
                <Tab eventKey={active} title="Encargados">
                    <Login />
                </Tab>
                <Tab eventKey="empleados" title="Empleados">
                    <Login />
                </Tab>
                <Tab eventKey="repartidores" title="Repartidores">
                    <Login />
                </Tab>
                <Tab eventKey="clientes" title="Clientes">
                    <Login />
                </Tab>
            </Tabs>
        </div>
    )
}