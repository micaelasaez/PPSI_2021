import React, { useState } from 'react';
import '../styles.css';
import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';
import Login from './Login';
import Button from 'react-bootstrap/Button';
import UsuariosList from './UsuariosList';
import AddProduct from '../Forms/AddProduct';
import SignUp from '../Forms/SignUp';

export default function AdminView() {
    const active = "products";
    const [showUsuarios, setShowUsuarios] = useState(false);

    return (
        <div>
            <br />
            <Tabs justify defaultActiveKey={active} style={{ backgroundColor: 'white' }}>
                <Tab eventKey={active} title="BEBIDAS">
                    <AddProduct />
                </Tab>
                <Tab eventKey="users" title="USUARIOS">
                    <Button onClick={() => setShowUsuarios(false)} className="personalized-button" 
                        style={{ height: '50px', width: '300px', margin: '25px' }}>
                        AGREGAR USUARIOS
                    </Button>
                    <Button onClick={() => setShowUsuarios(true)} className="personalized-button" 
                        style={{ height: '50px', width: '300px', margin: '25px' }}>
                        LISTAS DE USUARIOS
                    </Button>
                    {showUsuarios
                        ? <UsuariosList />
                        : <SignUp adminMode={true}/>
                    }
                </Tab>
                <Tab eventKey="bancos-tarjetas" title="BANCOS Y TARJETAS">
                    <Login />
                </Tab>
                <Tab eventKey="sucursal" title="SUCURSAL">
                    <Login />
                </Tab>
                <Tab eventKey="precios-envio" title="PRECIOS DE ENVÍOS">
                    <Login />
                </Tab>
            </Tabs>
        </div>
    )
}