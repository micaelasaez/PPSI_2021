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
                    <ShowUsuarios type="encargado" />
                </Tab>
                <Tab eventKey="empleados" title="Empleados">
                    <ShowUsuarios type="empleado" />
                </Tab>
                <Tab eventKey="repartidores" title="Repartidores">
                    <ShowUsuarios type="repartidor" />
                </Tab>
                <Tab eventKey="clientes" title="Clientes">
                    <ShowUsuarios type="cliente" />
                </Tab>
            </Tabs>
        </div>
    )
}