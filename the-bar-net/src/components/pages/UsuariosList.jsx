import React from 'react';
import '../styles.css';
import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';
import Button from 'react-bootstrap/Button';
import ShowUsuarios from '../ShowUsuarios';
import { useState } from 'react';

export default function UsuariosList() {
    const active = "encargados";
    const [showListNoConfiables, setShowListNoConfiables] = useState(false);

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
                    <br/>
                    <h4>Seleccione algún cliente para ver sus pedidos realizados.</h4>
                    <br/>
                    <Button onClick={() => { setShowListNoConfiables(show => !show)}} variant="danger">
                        {showListNoConfiables ? 'VER TODOS LOS USUARIOS' : 'FILTRAR LISTA NO CONFIABLES'}
                    </Button>
                    <ShowUsuarios type="cliente" showListNoConfiables={showListNoConfiables} />
                </Tab>
            </Tabs>
        </div>
    )
}