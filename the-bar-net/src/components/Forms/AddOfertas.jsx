import React, { useCallback, useEffect, useState } from 'react';
import '../styles.css';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { TheBarNetServerUrl } from '../context/Url';
import Product from '../Product';

const categories = [
    { name: 'cervezas', title: 'Cervezas' },
    { name: 'vinos', title: 'Vinos' },
    { name: 'espumantes', title: 'Espumantes' },
    { name: 'vodka', title: 'Vodkas' },
    { name: 'whiskys', title: 'Whiskys' },
    { name: 'sin-alcohol', title: 'Sin Alcohol' }
];
const quantityTypes = [
    { key: "ml", type: "Mili Litros" },
    { key: "l", type: "Litro" },
    { key: "six-pack", type: "Six Pack" },
    { key: "12u", type: "Caja 12 unidades" },
    { key: "24u", type: "Caja 24 unidades" }
];

export default function AddOfertas() {
    const [productos, setProductos] = useState([]);
    const [showAlert, setShowAlert] = useState(false);
    const [alertMsg, setAlertMsg] = useState('');

    const handleSubmitOferta = useCallback((producto, nuevoPrecio, fechaInicio, fechaFin) => {
        const oferta = {
            idProducto: producto.id,
            nuevoPrecio: nuevoPrecio,
            fechaInicio: fechaInicio,
            fechaFin: fechaFin
        };
        console.log(oferta);
        fetch(TheBarNetServerUrl.ofertas, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            mode: 'cors', // no-cors
            body: JSON.stringify(oferta)
        })
            .then(res => res.json())
            .catch(error => console.error('Error:', error))
            .then(response => {
                console.log(response);
                setAlertMsg('Oferta creada correctamente!');
                setShowAlert(true);
            })
            .catch(() => {
                setAlertMsg('Algo falló con la creación de la oferta!');
                setShowAlert(true);
            });
    }, []);


    useEffect(() => {
        fetch(TheBarNetServerUrl.products, {
            mode: 'cors'
        }).then(res => res.json())
            .then(response => {
                console.log(response.rta)
                setProductos(response.rta);
            })
    }, [])

    return (
        <>
            <div style={{ height: "100%", width: "100%", margin: "auto" }}>
                <br />
                <h1 className="tittle-style" style={{ marginBottom: "30px", fontSize: "35px", marginTop: "40px" }}>AGREGAR OFERTA</h1>
                <p>
                    Los productos se encuentran ordenados por la fecha de vencimiento más cercana.
                </p>
                {productos.length > 0
                    ? <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-around', alignItems: 'stretch' }}>
                        {productos.map(p => (
                            p.stockActual > 0 &&
                            <Product
                                key={p.id}
                                p={p}
                                modoOferta
                                handleSubmitOferta={handleSubmitOferta}
                            />
                        ))}
                    </div>
                    : <div>
                        <h3>Disculpe, no hay productos actualmente!</h3>
                        <br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br />
                    </div>
                }
                <br /><br /><br />
            </div>
            <Modal show={showAlert} onHide={() => setShowAlert(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Aviso</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>{alertMsg}</p>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={() => { setShowAlert(false); window.location.reload(); }}>
                        Volver
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}