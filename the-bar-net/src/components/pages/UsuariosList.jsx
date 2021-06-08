import React from 'react';
import '../styles.css';
import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';
import ShowUsuarios from '../ShowUsuarios';

export default function UsuariosList() {
    const active = "encargados";

    return (
        <div>
            <br />
            <Tabs justify defaultActiveKey={active} style={{ backgroundColor: 'white' }}>
                <Tab eventKey={active} title="Encargados">
                    <ShowUsuarios type="encargados" />
                </Tab>
                <Tab eventKey="empleados" title="Empleados">
                    <ShowUsuarios type="empleados" />
                </Tab>
                <Tab eventKey="repartidores" title="Repartidores">
                    <ShowUsuarios type="repartidores" />
                </Tab>
                <Tab eventKey="clientes" title="Clientes">
                    <ShowUsuarios type="clientes" />
                </Tab>
            </Tabs>
        </div>
    )
}