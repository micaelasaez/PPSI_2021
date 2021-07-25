import React, { useState } from 'react';
import '../../styles.css';
import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';
import Button from 'react-bootstrap/Button';
import ShowUsuarios from '../../ShowUsuarios';
import PedidosViewEmpleado from '../PedidosViewEmpleado';
import AddEnvio from '../../Forms/AddEnvio';

export default function EmpleadoView() {
    const active = "pedidos";
    const [activeKey, setActiveKey] = useState(active);
    const [showListNoConfiables, setShowListNoConfiables] = useState(false);

    return (
        <div>
            <br />
            <h5 style={{ marginBottom: '25px' }}>EMPLEADO</h5>
            <Tabs justify defaultActiveKey={active} style={{ backgroundColor: 'white' }} onSelect={(p) => setActiveKey(p)}>
                <Tab eventKey={active} title="PEDIDOS PARA PREPARAR">
                    {(activeKey === active) && <>
                        <PedidosViewEmpleado />
                    </>}
                </Tab>
                <Tab eventKey="entrega-sucursal" title="ENTREGAS SUCURSAL">
                    {(activeKey === "entrega-sucursal") && <>
                        <PedidosViewEmpleado entregaSucursal />
                    </>}
                </Tab>
                {/* <Tab eventKey="envios" title="ENVIOS">
                    {(activeKey === "envios") && <>
                        {/* <h3>ENVIOS</h3>
                        <AddEnvio />
                    </>
                </Tab> */}
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