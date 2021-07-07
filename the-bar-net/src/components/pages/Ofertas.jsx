import React, { useContext, useEffect, useState } from 'react';
import { TheBarNetServerUrl } from '../context/Url';
import '../styles.css';
import Product from '../Product';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { TheNetBar } from '../context/TheNetBarContext';
import { useLocation } from 'react-router-dom';
import { useCallback } from 'react';

export const Ofertas = () => {
    const { addCarrito } = useContext(TheNetBar.Context);
    const [ofertas, setOfertas] = useState([]);
    const [adminMode, setAdminMode] = useState(false);
    const { state } = useLocation();
    const [showAlert, setShowAlert] = useState(false);
    const [alertMsg, setAlertMsg] = useState('');


    const addCarritoLocal = (p, cantidad) => {
        // console.log(p, cantidad);
        const newProd = {
            precio: p.nuevoPrecio,
            stockActual: p.StockActual,
            cantidad: p.cantidad,
            categoria: p.categoria,
            fechaFin: p.fechaFin,
            fechaInicio: p.fechaInicio,
            fechaVencimiento: p.fechaVencimiento,
            fotos: p.fotos,
            id: p.id,
            nombre: p.nombre,
            nuevoPrecio: p.nuevoPrecio,
            stockMax: p.stockMax,
            stockMin: p.stockMin
        }
        addCarrito(newProd, cantidad);
    }

    const handleDeleteOferta = useCallback((oferta) => {
        // console.log('delete', oferta)
        fetch(TheBarNetServerUrl.ofertas + oferta.id, {
            mode: 'cors',
            method: 'DELETE'
        }).then(res => res.json())
            .then(response => {
                console.log(response);
                // alert('borrada')
                setAlertMsg('Oferta borrada correctamente!');
                setShowAlert(true);
            
                fetch(TheBarNetServerUrl.ofertas, {
                    mode: 'cors'
                }).then(res => res.json())
                    .then(response => {
                        setOfertas(response.rta);
                    })
            })
            .catch(() => {
                setAlertMsg('Algo falló borrando la oferta!');
                setShowAlert(true);
            });
    }, []);

    const handleUpdateOferta = useCallback((p, fechaFin) => {
        console.log('update', p, fechaFin);
    }, []);

    useEffect(() => {
        if (state && state.adminMode) {
            setAdminMode(true);
        }
        fetch(TheBarNetServerUrl.ofertas, {
            mode: 'cors'
        }).then(res => res.json())
            .then(response => {
                setOfertas(response.rta);
            })
    }, [state]);

    return (
        <div style={{ height: '100%' }}>
            <h1 className="tittle-style" style={{ marginTop: "50px" }}>OFERTAS</h1>
            {ofertas.length > 0
                ? <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-around', alignItems: 'stretch' }}>
                    {ofertas.map(o => (
                        <Product
                            key={o.id}
                            addCarrito={addCarritoLocal}
                            adminMode={adminMode}
                            handleDeleteOferta={handleDeleteOferta}
                            handleUpdateOferta={handleUpdateOferta}
                            p={{
                                // fotos: o.fotos,
                                // nombre: o.nombre,
                                // cantidad: o.cantidad,
                                // oldPrice: o.precio,
                                // precio: o.nuevoPrecio,
                                stockActual: o.StockActual,
                                ...o
                            }} />
                    ))}
                </div>
                : <div>
                    <h3>No hay ofertas disponibles actualmente :( </h3>
                </div>
            }
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