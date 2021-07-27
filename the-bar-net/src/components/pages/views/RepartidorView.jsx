import React, { useState } from 'react';
import '../../styles.css';
import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';
import ShowUsuarios from '../../ShowUsuarios';
import AddEnvio from '../../Forms/AddEnvio';
import ShowEnvios from '../ShowEnvios';
import ShowEntregados from '../ShowEntregados';

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
                <Tab eventKey="remito" title="CONSTANCIAS DE ENTREGA">
                    {(activeKey === "remito") && <>
                        <ShowEntregados />
                    </>}
                </Tab>
                <Tab eventKey="users" title="LISTA DE CLIENTES">
                    {(activeKey === "users") && <>
                        <br />
                        <h4>Seleccione algún cliente para ver su historial de pedidos realizados.</h4>
                        <ShowUsuarios type="cliente" cantEdit/>
                    </>}
                </Tab>
            </Tabs>
        </div>
    )
}