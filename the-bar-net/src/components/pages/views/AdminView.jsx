import React, { useState } from 'react';
import '../../styles.css';
import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';
import Button from 'react-bootstrap/Button';
import UsuariosList from '../UsuariosList';
import AddProduct from '../../Forms/AddProduct';
import AddCatergory from '../../Forms/AddCatergory';
import SignUp from '../../Forms/SignUp';

export default function AdminView() {
    const active = "products";
    const [showUsuarios, setShowUsuarios] = useState(false);

    return (
        <div>
            <br />
            <Tabs justify defaultActiveKey={active} style={{ backgroundColor: 'white' }}>
                <Tab eventKey="categorias" title="CATEGORIAS">
                    <AddCatergory />
                </Tab>
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
                    <h3>BANCOS Y TARJETAS</h3>
                </Tab>
                <Tab eventKey="sucursal" title="SUCURSAL">
                    <h3>SUCURSAL</h3>
                </Tab>
                <Tab eventKey="precios-envio" title="PRECIOS DE ENVÍOS">
                    <h3>PRECIOS DE ENVÍOS</h3>
                </Tab>
            </Tabs>
        </div>
    )
}