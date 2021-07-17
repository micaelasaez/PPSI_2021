import React, { useContext, useEffect, useState } from 'react';
import '../styles.css';
import { TheBarNetServerUrl } from '../context/Url';
import { TheNetBar } from '../context/TheNetBarContext';
import ProductSmall from '../ProductSmall';
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

export default function Stocks() {
    const { addCarrito } = useContext(TheNetBar.Context);
    const [products, setProducts] = useState([]);
    const [showAlert, setShowAlert] = useState(false);
    const [alertMsg, setAlertMsg] = useState('');

    const rojo = '#cd2b3ba3';
    const naranja = '#d37f00e6';
    const verde = '#2ab049ad';

    // const addCarritoLocal = (p, cantidad) => {
    //     // console.log(p.precio, cantidad);
    //     addCarrito(p, cantidad);
    // }

    const updateStocks = (p, stockActual, stockMin, stockMax) => {
        console.log(stockActual, stockMin, stockMax)
        const prod = {
            nombre: p.nombre,
            categoria: p.categoria,
            precio: p.precio,
            cantidad: p.cantidad,
            fechaVencimiento: p.fechaVencimiento,
            fotos: p.fotos,
            stockMin: stockMin,
            stockMax: stockMax,
            stockActual: stockActual
        };
        fetch(TheBarNetServerUrl.products + `/${p.id}`, {
            mode: 'cors',
            method: 'PUT',
            body: JSON.stringify(prod)
        }).then(res => res.json())
            .then(response => {
                console.log(response);
                // setProducts(response.rta)
            })
    }

    useEffect(() => {
        fetch(TheBarNetServerUrl.products, {
            mode: 'cors'
        }).then(res => res.json())
            .then(response => {
                // console.log(response);
                setProducts(response.rta)
            })
    }, []);

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
            <h1 className="tittle-style" style={styles.title}>STOCKS</h1>
            <p style={{ fontSize: 'larger', fontWeight: 500 }}>
                Referencia de stocks de los productos disponibles:
                <br />
                <li><span style={{ textShadow: `2px 2px ${verde}` }}>VERDE</span> el stock actual está lejos del stock mínimo disponible</li>
                <li><span style={{ textShadow: `2px 2px ${naranja}` }}>NARANJA</span> el stock está próximo a agotarse</li>
                <li><span style={{ textShadow: `2px 2px ${rojo}` }}>ROJO</span> queda sólo 1 unidad</li>
            </p>
            <div style={styles.product}>
                {products.length > 0
                    ? products.map(p => (
                        <ProductSmall
                            key={p.id}
                            p={p}
                            modoStock
                            updateStocks={updateStocks}
                        />
                    ))
                    : <p>
                        <h3>No hay productos actualmente!</h3>
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
                        <Button variant="primary" onClick={() => setShowAlert(false)}>
                            Aceptar
                        </Button>
                    </Modal.Footer>
                </Modal>
        </div>
    )
}