import React, { useState } from 'react';
import '../../styles.css';
import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';
import Button from 'react-bootstrap/Button';
import ShowUsuarios from '../../ShowUsuarios';
import PedidosView from '../PedidosView';

export default function EmpleadoView() {
    const active = "pedidos";
    const [activeKey, setActiveKey] = useState(active);
    const [showListNoConfiables, setShowListNoConfiables] = useState(false);

    return (
        <div>
            <br />
            <h5 style={{ marginBottom: '25px' }}>EMPLEADO</h5>
            <Tabs justify defaultActiveKey={active} style={{ backgroundColor: 'white' }} onSelect={(p) => setActiveKey(p)}>
                <Tab eventKey={active} title="PEDIDOS">
                    {(activeKey === active) && <>
                        <PedidosView />
                    </>}
                </Tab>
                <Tab eventKey="envios" title="ENVIOS">
                    {(activeKey === "envios") &&
                        <h3>ENVIOS</h3>}
                </Tab>
                <Tab eventKey="users" title="CLIENTES">
                    {activeKey === 'users' && <>
                        <br />
                        <br />
                        <h4>Seleccione algún cliente para ver su historial de pedidos realizados.</h4>
                        <br />
                        <Button onClick={() => { setShowListNoConfiables(show => !show) }} variant="danger">
                            {showListNoConfiables ? 'VER TODOS LOS USUARIOS' : 'FILTRAR LISTA NO CONFIABLES'}
                        </Button>
                        <ShowUsuarios type="cliente" showListNoConfiables={showListNoConfiables} />
                    </>}
                </Tab>
            </Tabs>
        </div>
    )
}