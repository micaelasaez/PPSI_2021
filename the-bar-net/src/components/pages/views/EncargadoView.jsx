import React, { useState } from 'react';
import '../../styles.css';
import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';
import Button from 'react-bootstrap/Button';
import UsuariosList from '../UsuariosList';
import AddProduct from '../../Forms/AddProduct';
import AddOfertas from '../../Forms/AddOfertas';
import AddCombos from '../../Forms/AddCombo';
import { useHistory } from 'react-router-dom';
import Stocks from '../Stocks';
import BancosYPromos from '../BancosYPromos';
import PedidosView from '../PedidosView';
import AddCatergory from '../../Forms/AddCatergory';
import Categories from '../../Categories';

export default function EncargadoView() {
    const active = "products";
    const history = useHistory();
    const [activeKey, setActiveKey] = useState(active);
    const [disableSelect, setDisableSelect] = useState(true);

    return (
        <div>
            <br />
            <h5 style={{ marginBottom: '25px' }}>ENCARGADO</h5>
            <Tabs justify defaultActiveKey={active} style={{ backgroundColor: 'white', fontWeight: 500 }} onSelect={(p) => setActiveKey(p)}>
                <Tab eventKey="categorias" title="CATEGORIAS">
                    {activeKey === 'categorias' && <>
                        <AddCatergory updateCategorias={() => {
                            setDisableSelect(false);
                            setDisableSelect(true);
                        }}
                        />
                        <h4>CATEGORÍAS DISPONIBLES</h4>
                        <Categories disableSelect={disableSelect} />
                    </>}
                </Tab>
                <Tab eventKey={active} title="BEBIDAS">
                    {(activeKey === active) && <>
                        <div style={{ marginTop: '50px' }}>
                            <Button className="personalized-button" onClick={() => history.push({ pathname: "/productos", state: { adminMode: true } })}>
                                VER BEBIDAS ACTUALES DEL SITIO
                            </Button>
                        </div>
                        <AddProduct />
                    </>}
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
                <Tab eventKey={'pedidos'} title="PEDIDOS">
                    {(activeKey === 'pedidos') && <>
                        <PedidosView />
                    </>}
                </Tab>
                <Tab eventKey="promociones-bancarias" title="PROMOCIONES BANCARIAS">
                    {activeKey === 'promociones-bancarias' && <BancosYPromos />}
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