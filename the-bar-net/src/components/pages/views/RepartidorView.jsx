import React, { useState } from 'react';
import '../../styles.css';
import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';
import Button from 'react-bootstrap/Button';
import UsuariosList from '../UsuariosList';
import ShowUsuarios from '../../ShowUsuarios';
import AddEnvio from '../../Forms/AddEnvio';
import ShowEnvios from '../ShowEnvios';

export default function RepartidorView() {
    const active = "pedidos";
    const [activeKey, setActiveKey] = useState(active);

    return (
        <div>
            <br />
            <h5 style={{ marginBottom: '25px' }}>REPARTIDOR</h5>
            <Tabs justify defaultActiveKey={active} style={{ backgroundColor: 'white' }} onSelect={(p) => setActiveKey(p)}>
                <Tab eventKey={active} title="PEDIDOS">
                    {(activeKey === active) && <>
                        {/* <h3>PEDIDOS PREPARADOS PARA ENVIAR</h3> */}
                        <AddEnvio />
                    </>}
                </Tab>
                <Tab eventKey="envios" title="ENVIOS">
                    {(activeKey === "envios") && <>
                        {/* <h3>ENVIOS</h3> */}
                        <ShowEnvios />
                    </>}
                </Tab>
                <Tab eventKey="remito" title="REMITOS">
                    <h3>REMITOS</h3>
                </Tab>
                <Tab eventKey="users" title="LISTA DE CLIENTES">
                    <ShowUsuarios type="cliente" />
                </Tab>
            </Tabs>
        </div>
    )
}