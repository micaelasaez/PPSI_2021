import React, { useCallback, useEffect, useState } from 'react';
import '../styles.css';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { TheBarNetServerUrl } from '../context/Url';
import Product from '../Product';

// const categories = [
//     { name: 'cervezas', title: 'Cervezas' },
//     { name: 'vinos', title: 'Vinos' },
//     { name: 'espumantes', title: 'Espumantes' },
//     { name: 'vodka', title: 'Vodkas' },
//     { name: 'whiskys', title: 'Whiskys' },
//     { name: 'sin-alcohol', title: 'Sin Alcohol' }
// ];
// const quantityTypes = [
//     { key: "ml", type: "Mili Litros" },
//     { key: "l", type: "Litro" },
//     { key: "six-pack", type: "Six Pack" },
//     { key: "12u", type: "Caja 12 unidades" },
//     { key: "24u", type: "Caja 24 unidades" }
// ];

export default function AddOfertas() {
    const todayDate = new Date().toJSON().slice(0, 10).replace(/-/g, '-');
    const [productos, setProductos] = useState([]);
    const [ofertas, setOfertas] = useState([]);
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
                fetch(TheBarNetServerUrl.ofertas, {
                    mode: 'cors'
                }).then(res => res.json())
                    .then(response => {
                        setOfertas(response.rta);
                    })
            })
            .catch(() => {
                setAlertMsg('Algo falló con la creación de la oferta!');
                setShowAlert(true);
            });
    }, []);

    const handleDeleteOferta = useCallback((oferta) => {
        console.log('delete', oferta);
    }, []);

    useEffect(() => {
        fetch(TheBarNetServerUrl.products, {
            mode: 'cors'
        }).then(res => res.json())
            .then(response => {
                // console.log('productos', response.rta.map(m=>m.fechaVencimiento))
                const prodsVigentes = (response.rta.sort((a, b) => {
                    return new Date(a.fechaVencimiento) - new Date(b.fechaVencimiento);
                }));
                // console.log('vigentes', prodsVigentes.map(m=>m.fechaVencimiento))

                setProductos(prodsVigentes);

                fetch(TheBarNetServerUrl.ofertas, {
                    mode: 'cors'
                }).then(res => res.json())
                    .then(response => {
                        // const ofertasVigentes = [];
                        // response.rta.forEach(element => {
                        //     if (new Date(element.fechaFin) > new Date(todayDate)) {
                        //         ofertasVigentes.push(element)
                        //     }
                        // });
                        setOfertas(response.rta);
                        // console.log('ofertas', response.rta)
                        // console.log('ofertas', ofertasVigentes)
                    })
            })
    }, []);

    return (
        <>
            <div style={{ height: "100%", width: "100%", margin: "auto" }}>
                <br />
                <h1 className="tittle-style" style={{ marginBottom: "30px", fontSize: "35px", marginTop: "40px" }}>AGREGAR OFERTA</h1>
                <h4>
                    Los productos se encuentran ordenados por la fecha de vencimiento más cercana.
                </h4>
                {Array.isArray(ofertas) && ofertas.length > 0 && productos.length > 0
                    ? <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-around', alignItems: 'stretch' }}>
                        {productos.map(p => {
                            if (p.stockActual > 0) {
                                let disableOferta = false;
                                ofertas.forEach(o => {
                                    if (new Date(o.fechaFin) > new Date(todayDate)) {
                                        if (o.nombre === p.nombre && o.cantidad === p.cantidad) {
                                            disableOferta = true;
                                        }
                                    }
                                })
                                return <Product
                                    key={p.id}
                                    p={{ ...p }}
                                    modoOferta
                                    handleSubmitOferta={handleSubmitOferta}
                                    handleDeleteOferta={handleDeleteOferta}
                                    disableOferta={disableOferta}
                                />
                            } else {
                                return undefined;
                            }
                        })}
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
                    <Button variant="primary" onClick={() => { setShowAlert(false); }}>
                        Volver
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}