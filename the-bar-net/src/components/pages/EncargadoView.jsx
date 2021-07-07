import React, { useState } from 'react';
import '../styles.css';
import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';
import Login from './Login';
import Button from 'react-bootstrap/Button';
import UsuariosList from './UsuariosList';
import AddProduct from '../Forms/AddProduct';
import AddCatergory from '../Forms/AddCatergory';
import AddOfertas from '../Forms/AddOfertas';
import AddCombos from '../Forms/AddCombo';
import SignUp from '../Forms/SignUp';
import { useHistory } from 'react-router-dom';

export default function EncargadoView() {
    const active = "products";
    const [showUsuarios, setShowUsuarios] = useState(false);
    const history = useHistory();

    return (
        <div>
            ENCARGADO
            <br />
            <Tabs justify defaultActiveKey={active} style={{ backgroundColor: 'white' }}>
                <Tab eventKey={active} title="BEBIDAS">
                    <AddProduct />
                </Tab>
                <Tab eventKey="stocks" title="MANEJO DE STOCKS">
                    <h3>STOCKS</h3>
                </Tab>
                <Tab eventKey="ofertas" title="OFERTAS">
                    <div style={{ marginTop: '50px' }}>
                        <Button className="personalized-button" onClick={() => history.push({ pathname: "/ofertas", state: { adminMode: true } })}>
                            VER OFERTAS ACTUALES DEL SITIO
                        </Button>
                    </div>
                    <AddOfertas />
                </Tab>
                <Tab eventKey="combos" title="COMBOS">
                    <div style={{ marginTop: '50px' }}>
                        <Button className="personalized-button" onClick={() => history.push({ pathname: "/combos", state: { adminMode: true } })}>
                            VER COMBOS ACTUALES DEL SITIO
                        </Button>
                    </div>
                    <AddCombos />
                </Tab>
                {/* <Tab eventKey="bancos-tarjetas" title="BANCOS Y TARJETAS">
                    <h3>BANCOS Y TARJETAS</h3>
                </Tab> */}
                <Tab eventKey="promociones-bancarias" title="PROMOCIONES BANCARIAS">
                    <h3>PROMOCIONES BANCARIAS</h3>
                </Tab>
                <Tab eventKey="users" title="USUARIOS">
                    {/* <Button onClick={() => setShowUsuarios(false)} className="personalized-button" 
                        style={{ height: '50px', width: '300px', margin: '25px' }}>
                        PEDIDOS DE USUARIOS
                    </Button> */}
                    <br />
                    <h3>LISTAS DE USUARIOS</h3>
                    {/* </Button>
                    {showUsuarios */}
                        <UsuariosList />
                        {/* : <h3>PEDIDOS POR USUARIO</h3>
                    } */}
                </Tab>
            </Tabs>
        </div>
    )
}