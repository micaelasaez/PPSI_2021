import React, { useState } from 'react';
import '../../styles.css';
import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';
import Button from 'react-bootstrap/Button';
import UsuariosList from '../UsuariosList';
import AddProduct from '../../Forms/AddProduct';
import AddCatergory from '../../Forms/AddCatergory';
import AddOfertas from '../../Forms/AddOfertas';
import AddCombos from '../../Forms/AddCombo';
import { useHistory } from 'react-router-dom';
import Stocks from '../Stocks';

export default function EncargadoView() {
    const active = "products";
    const history = useHistory();
    const [activeKey, setActiveKey] = useState(active);

    return (
        <div>
            <br />
            <h5 style={{ marginBottom: '25px' }}>ENCARGADO</h5>
            <Tabs justify defaultActiveKey={active} style={{ backgroundColor: 'white', fontWeight: 500 }} onSelect={(p) => setActiveKey(p)}>
                <Tab eventKey={active} title="BEBIDAS">
                    {(activeKey === active) && <AddProduct />}
                </Tab>
                <Tab eventKey="stocks" title="MANEJO DE STOCKS">
                    {activeKey === 'stocks' && <Stocks />}
                </Tab>
                <Tab eventKey="ofertas" title="OFERTAS">
                    {activeKey === 'ofertas' && <>
                        <div style={{ marginTop: '50px' }}>
                            <Button className="personalized-button" onClick={() => history.push({ pathname: "/ofertas", state: { adminMode: true } })}>
                                VER Y EDITAR OFERTAS ACTUALES DEL SITIO
                            </Button>
                        </div>
                        <AddOfertas />
                    </>}
                </Tab>
                <Tab eventKey="combos" title="COMBOS">
                    {activeKey === 'combos' && <>
                        <div style={{ marginTop: '50px' }}>
                            <Button className="personalized-button" onClick={() => history.push({ pathname: "/combos", state: { adminMode: true } })}>
                                VER Y EDITAR COMBOS ACTUALES DEL SITIO
                            </Button>
                        </div>
                        <AddCombos />
                    </>}
                </Tab>
                {/* <Tab eventKey="bancos-tarjetas" title="BANCOS Y TARJETAS">
                    <h3>BANCOS Y TARJETAS</h3>
                </Tab> */}
                <Tab eventKey="promociones-bancarias" title="PROMOCIONES BANCARIAS">
                    <h3>PROMOCIONES BANCARIAS</h3>
                </Tab>
                <Tab eventKey="users" title="USUARIOS">
                    {activeKey === 'users' && <>
                        <br />
                        <h3>LISTAS DE USUARIOS</h3>
                        <UsuariosList />
                    </>}
                </Tab>
            </Tabs>
        </div>
    )
}