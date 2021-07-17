import React, { useState } from 'react';
import '../../styles.css';
import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';
import Button from 'react-bootstrap/Button';
import UsuariosList from '../UsuariosList';
export default function EmpleadoView() {
    const active = "products";
    const [showUsuarios, setShowUsuarios] = useState(false);

    return (
        <div>
            EMPLEADO
            <br />
            <Tabs justify defaultActiveKey={active} style={{ backgroundColor: 'white' }}>
                <Tab eventKey="pedidos" title="PEDIDOS">
                    <h3>PEDIDOS DEL SITIO</h3>
                    <h3>PEDIDOS ENVIO SUCURSAL</h3>
                </Tab>
                <Tab eventKey={active} title="ENVIOS">
                    <h3>ENVIOS</h3>
                </Tab>
                <Tab eventKey="users" title="USUARIOS">
                    <Button onClick={() => setShowUsuarios(false)} className="personalized-button"
                        style={{ height: '50px', width: '300px', margin: '25px' }}>
                        PEDIDOS DE USUARIOS
                    </Button>
                    <Button onClick={() => setShowUsuarios(true)} className="personalized-button"
                        style={{ height: '50px', width: '300px', margin: '25px' }}>
                        LISTAS DE USUARIOS
                    </Button>
                    {showUsuarios
                        ? <UsuariosList />
                        : <h3>PEDIDOS POR USUARIO</h3>
                    }
                </Tab>
            </Tabs>
        </div>
    )
}