import React, { useState } from 'react';
import '../../styles.css';
import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import UsuariosList from '../UsuariosList';
import AddProduct from '../../Forms/AddProduct';
import AddCatergory from '../../Forms/AddCatergory';
import SignUp from '../../Forms/SignUp';
import Sucursal from '../../Sucursal';
import BancosYPromos from '../BancosYPromos';
import Categories from '../../Categories';
import AddPrecioEnvio from '../../Forms/AddPrecioEnvio';
import { useHistory } from 'react-router-dom';

export default function AdminView() {
    const active = "products";
    const [showUsuarios, setShowUsuarios] = useState(true);
    const [activeKey, setActiveKey] = useState(active);
    const [disableSelect, setDisableSelect] = useState(true);
    const [showAlert, setShowAlert] = useState(false);
    const [alertMsg, setAlertMsg] = useState('');
    const history = useHistory();

    return (
        <div>
            <br />
            <h5 style={{ marginBottom: '25px' }}>ADMIN</h5>
            <Tabs justify defaultActiveKey={active} style={{ backgroundColor: 'white' }} onSelect={(p) => setActiveKey(p)}>
                <Tab eventKey="categorias" title="CATEGORIAS">
                    {activeKey === 'categorias' && <>
                        <AddCatergory updateCategorias={() => { setDisableSelect(false); setDisableSelect(true); }} />
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
                <Tab eventKey="users" title="USUARIOS">
                    {activeKey === 'users' && <>
                        <Button onClick={() => setShowUsuarios(s => !s)} className="personalized-button"
                            style={{ height: '50px', width: '300px', margin: '25px' }}>
                            {showUsuarios ? 'AGREGAR USUARIOS' : 'LISTAS DE USUARIOS'}
                        </Button>
                        {showUsuarios
                            ? <UsuariosList />
                            : <SignUp adminMode={true}
                                changeView={() => {
                                    setAlertMsg('Usuario creado!');
                                    setShowAlert(true);
                                    setShowUsuarios(true);
                                }}
                            />
                        }
                    </>}
                </Tab>
                <Tab eventKey="bancos-tarjetas" title="BANCOS Y TARJETAS">
                    {activeKey === 'bancos-tarjetas' && <BancosYPromos />}
                </Tab>
                <Tab eventKey="sucursal" title="SUCURSAL">
                    {activeKey === 'sucursal' && <Sucursal adminMode />}
                </Tab>
                <Tab eventKey="precios-envio" title="PRECIOS DE ENVÍOS">
                    {activeKey === 'precios-envio' && <AddPrecioEnvio />}
                </Tab>
            </Tabs>
            <Modal show={showAlert} onHide={() => setShowAlert(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Aviso</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>{alertMsg}</p>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={() => setShowAlert(false)}>
                        Aceptar
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    )
}