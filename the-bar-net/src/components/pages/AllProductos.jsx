import React, { useContext, useEffect, useState } from 'react';
import { useLocation } from 'react-router';
import '../styles.css';
import Product from '../Product';
import { TheBarNetServerUrl } from '../context/Url';
import { TheNetBar } from '../context/TheNetBarContext';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

const styles = {
    product: {
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
        alignItems: 'stretch'
    },
    title: {
        marginTop: '25px'
    }
}

export default function AllProductos() {
    const { addCarrito } = useContext(TheNetBar.Context);
    const { state } = useLocation();
    const [adminMode, setAdminMode] = useState(false);
    const [products, setProducts] = useState([]);
    const [showAlert, setShowAlert] = useState(false);
    const [alertMsg, setAlertMsg] = useState('');

    const handleDeleteProd = (prod) => {
        console.log('delete', prod);
        fetch(TheBarNetServerUrl.products + `/${prod.id}`, {
            mode: 'cors',
            method: 'DELETE'
        }).then(res => res.json())
            .then(response => {
                setAlertMsg('Bebida borrada correctamente!');
                setShowAlert(true);

                fetch(TheBarNetServerUrl.products, {
                    mode: 'cors'
                }).then(res => res.json())
                    .then(response => {
                        console.log(response);
                        setProducts(response.rta)
                    })
            })
            .catch(() => {
                setAlertMsg('Algo falló borrando la bebida!');
                setShowAlert(true);
            });
    }

    useEffect(() => {
        if (state && state.adminMode) {
            setAdminMode(true);
        }
        fetch(TheBarNetServerUrl.products, {
            mode: 'cors'
        }).then(res => res.json())
            .then(response => {
                console.log(response);
                setProducts(response.rta)
            })
    }, [state]);

    /* ejemplo producto
    StockMax: 53
    cantidad: " 473 ml"
    fechaVencimiento: ""
    fotos: "https://statics.dinoonline.com.ar/imagenes/full_600x600_ma/3100659_f.jpg"
    nombre: "Pack Cerveza Patagonia Weisse"
    precio: 700
    stockActual: 42
    stockMin: 30*/

    return (
        <div>
            <h1 className="tittle-style" style={styles.title}>BEBIDAS REGISTRADAS</h1>
            <div style={styles.product}>
                {products.length > 0
                    ? products.map(p => (
                        p.stockActual > 0 && <Product adminProdMode handleDeleteProd={handleDeleteProd} p={p} />
                    ))
                    : <p>
                        <h3>No hay bebidas actualmente!</h3>
                        <br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br />
                    </p>
                }
            </div>
            <Modal show={showAlert} onHide={() => setShowAlert(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Aviso</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>{alertMsg}</p>
                </Modal.Body>
                <Modal.Footer>
                    {/* window.location.reload(); */}
                    <Button variant="primary" onClick={() => { setShowAlert(false); window.location.reload(); }}>
                        Volver
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    )
}