import React, { useCallback, useEffect, useState } from 'react';
import '../styles.css';
import Card from 'react-bootstrap/Card';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { TheBarNetServerUrl } from '../context/Url';
import { modalidadEnvio, modalidadPago } from '../pages/FinalizarCompra';

const styles = {
    product: {
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
        alignItems: 'stretch',
        marginTop: '25px'
    },
    title: {
        marginTop: '25px',
        fontSize: '30px'
    }
}

export default function AddEnvio() {
    const [pedidos, setPedidos] = useState([]);
    const [pedidosToShow, setPedidosToShow] = useState([]);
    const [localidades, setLocalidades] = useState([]);

    const [showAlert, setShowAlert] = useState(false);
    const [alertMsg, setAlertMsg] = useState('');

    useEffect(() => {
        fetch(TheBarNetServerUrl.pedido, {
            mode: 'cors'
        }).then(res => res.json())
            .then(response => {
                setPedidos(response.rta);
                fetch(TheBarNetServerUrl.preciosEnvios, {
                    mode: 'cors'
                }).then(res => res.json())
                    .then(response => {
                        setLocalidades(response.rta);
                    });
            })
    }, []);

    useEffect(() => {
        pedidos.forEach(pedido => {
            if (pedido.estado === 'a_entregar' && pedido.tipoEnvio === 'envio') {
                fetch(TheBarNetServerUrl.users + `/${pedido.idUsuario}`, {
                    mode: 'cors'
                })
                    .then(res => res.json())
                    .then(response => {
                        const user = response.rta[0];
                        const newPedidoToShow = { ...pedido, usuario: user };
                        fetch(TheBarNetServerUrl.productoPedido + `/${pedido.id}`, {
                            mode: 'cors'
                        })
                            .then(res => res.json())
                            .then(response => {
                                console.log(response.rta);
                                if (response.rta.length > 0) {
                                    const productos = response.rta.map(r => r[0]);
                                    newPedidoToShow.productos = productos;
                                } else {
                                    newPedidoToShow.productos = [];
                                }
                                setPedidosToShow(p => [...p, newPedidoToShow]);
                            });
                    })
                    .catch(() => {
                        setPedidosToShow([]);
                    });
            }
        });
    }, [pedidos]);

    /* ejemplo pedido
        estado: "sin_pagar" "pagado" "a_entregar" "en_camino" "entregado" "cancelado" "rechazado"
        fecha: "2021-6-27 0:45:17"
        id: 8
        idUsuario: 24
        modalidadPago: "efectivo"
        tipoEnvio: "retiro"
        total: 2480
    */
    /* ejemplo producto
        StockMax: 53
        cantidad: " 473 ml"
        fechaVencimiento: ""
        fotos: "https://statics.dinoonline.com.ar/imagenes/full_600x600_ma/3100659_f.jpg"
        nombre: "Pack Cerveza Patagonia Weisse"
        precio: 700
        stockActual: 42
        stockMin: 30
    */

    const handleCreateEnvio = useCallback((idPedido) => {
        const pedidoAEnviar = pedidosToShow.find(p => p.id === idPedido);
        console.log('listo para enviar', pedidoAEnviar);
        // idUsuario, idPedido, idPrecioEnvio, precio, fecha, direccion, codigoPostal, entregado
        const localidad = localidades.find(l => l.id === Number.parseInt(pedidoAEnviar.usuario.localidad));

        console.log('precio envio', localidad)
        fetch(TheBarNetServerUrl.envios, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            mode: 'cors', // no-cors
            body: JSON.stringify({
                idUsuario: pedidoAEnviar.idUsuario,
                idPedido: pedidoAEnviar.id,
                idPrecioEnvio: localidad ? localidad.id : 1,
                precio: pedidoAEnviar.total,
                // fecha: '',
                direccion: localidad ? pedidoAEnviar.usuario.direccion + ', ' + localidad.localidad : pedidoAEnviar.usuario.direccion,
                codigoPostal: pedidoAEnviar.usuario.codigoPostal,
                // entregado: 'no'
            })
        }).then(res => res.json())
            .then(response => {
                console.log(response);
                fetch(TheBarNetServerUrl.pedido + `/${pedidoAEnviar.id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    mode: 'cors', // no-cors
                    body: JSON.stringify({
                        estado: 'a_enviar'
                    })
                }).then(res => res.json())
                    .then(response => {
                        console.log('response pedido', response);
                        const pedidosToShowAEntregar = pedidosToShow.filter(p => p.id !== pedidoAEnviar.id);
                        console.log(pedidosToShowAEntregar)
                        setPedidosToShow(pedidosToShowAEntregar);

                        setAlertMsg('El envío fue creado correctamente.');
                        setShowAlert(true);
                    });
            })
            .catch((e) => {
                console.log(e)
                setAlertMsg('Algo falló creando el envío!');
                setShowAlert(true);
            });
    }, [localidades, pedidosToShow]);

    const showProductos = (p) => {
        const prodsToShow = [];
        p.productos.forEach(prod => {
            const index = prodsToShow.findIndex(pts => pts.prod.fotos === prod.fotos);
            if (index !== -1) {
                prodsToShow[index].cantidad++;
            } else {
                prodsToShow.push({
                    prod: prod,
                    cantidad: 1
                });
            }
        });
        return prodsToShow.map(p => (
            <Card style={{ width: '20rem', height: 'fit-content', marginTop: '10px' }}>
                <Card.Img variant="top" src={p.prod.fotos}
                    style={{ width: '5rem', height: '5rem', margin: "auto" }} />
                <Card.Body>
                    <Card.Title>{p.prod.nombre} - {p.prod.cantidad}</Card.Title>
                    <Card.Title>Cant. unidades: {p.cantidad}</Card.Title>
                </Card.Body>
            </Card>
        ));
    }

    return (
        <div>
            <h1 className="tittle-style" style={styles.title}>PEDIDOS PREPARADOS LISTOS PARA ENVIAR</h1>
            <div style={styles.product}>
                {pedidosToShow.length > 0
                    ? pedidosToShow.map(p =>
                        <Card style={{ width: '700px', height: 'fit-content', margin: "20px" }} key={p.id}>
                            <Card.Body>
                                <Card.Title style={{ display: 'flex', justifyContent: 'space-around' }}>
                                    <span>Info del pedido:</span>
                                    <span>${p.total}</span>
                                </Card.Title>
                                <div style={{ width: '70%', margin: 'auto', fontSize: '1.1rem', lineHeight: 2.5 }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <span>Cliente:</span>
                                        <span>{`${p.usuario.nombre} ${p.usuario.apellido}`}</span>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <span>Fecha:</span>
                                        <span>{p.fecha}</span>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <span>Modalidad de Pago:</span>
                                        <span>{(modalidadPago.find(m => m.id === p.modalidadPago))?.name}</span>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <span>Modalidad de Envío:</span>
                                        <span>{(modalidadEnvio.find(m => m.id === p.tipoEnvio))?.name}</span>
                                    </div>
                                </div>
                                <br />
                                <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-around' }}>
                                    {showProductos(p)}
                                </div>
                                <br />
                                <Button variant="success" onClick={() => handleCreateEnvio(p.id)} >
                                    CREAR ENVÍO
                                </Button>
                            </Card.Body>
                        </Card>
                    )
                    : <p>
                        <h3>No hay pedidos listos para enviar actualmente!</h3>
                        <br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br />
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
                    <Button variant="primary" onClick={() => { setShowAlert(false); }}>
                        Volver
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    )
}