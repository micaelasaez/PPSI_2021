import React, { useCallback, useEffect, useState } from 'react';
import '../styles.css';
import { TheBarNetServerUrl } from '../context/Url';
import Card from 'react-bootstrap/Card';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { modalidadEnvio, modalidadPago } from './FinalizarCompra';

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

export default function PedidosViewEmpleado({ entregaSucursal = false }) {
    const [pedidos, setPedidos] = useState([]);
    const [pedidosToShow, setPedidosToShow] = useState([]);

    const [showAlert, setShowAlert] = useState(false);
    const [alertMsg, setAlertMsg] = useState('');

    useEffect(() => {
        fetch(TheBarNetServerUrl.pedido, {
            mode: 'cors'
        }).then(res => res.json())
            .then(response => {
                setPedidos(response.rta);
            })
    }, []);

    useEffect(() => {
        pedidos.forEach(pedido => {
            if (pedido.estado === 'a_entregar' || pedido.estado === 'sin_pagar' || pedido.estado === 'pagado') {
                fetch(TheBarNetServerUrl.users + `/${pedido.idUsuario}`, {
                    mode: 'cors'
                })
                    .then(res => res.json())
                    .then(response => {
                        const user = response.rta[0];
                        const newPedidoToShow = { ...pedido, usuario: user, showProds: false };
                        fetch(TheBarNetServerUrl.productoPedido + `/${pedido.id}`, {
                            mode: 'cors'
                        })
                            .then(res => res.json())
                            .then(response => {
                                // console.log(response);
                                if (response.rta.length > 0) {
                                    const productos = response.rta.map(r => r[0]);
                                    newPedidoToShow.productos = productos;
                                } else {
                                    newPedidoToShow.productos = [];
                                }

                                if (entregaSucursal && pedido.estado === 'a_entregar' && pedido.tipoEnvio === 'retiro') {
                                    setPedidosToShow(p => [...p, newPedidoToShow]);
                                } else if (!entregaSucursal && pedido.estado !== 'a_entregar') {
                                    setPedidosToShow(p => [...p, newPedidoToShow]);
                                }
                            });
                    })
                    .catch(() => {
                        setPedidosToShow([]);
                    })
            }
        });
    }, [entregaSucursal, pedidos]);

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
    stockMin: 30*/

    const handleUpdateEstado = useCallback((idPedido, newState) => {
        fetch(TheBarNetServerUrl.pedido + `/${idPedido}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            mode: 'cors', // no-cors
            body: JSON.stringify({
                estado: newState
            })
        }).then(res => res.json())
            .then(response => {
                console.log(response);
                const newPedidosToShow = pedidosToShow.filter(p => p.id !== idPedido);
                // const index = pedidosToShow.findIndex(p => p.id === idPedido);
                // pedidosToShow[index].estado = newState;
                setPedidosToShow(newPedidosToShow);

                setAlertMsg('Estado del pedido modificado correctamente!');
                setShowAlert(true);
            })
            .catch(() => {
                setAlertMsg('Algo falló modificando el estado del pedido!');
                setShowAlert(true);
            });
    }, [pedidosToShow]);

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
            <h1 className="tittle-style" style={styles.title}>
                {entregaSucursal ? 'PEDIDOS PREPARADOS CON ENTREGA SUCURSAL' : 'PEDIDOS PARA PREPARAR'}
            </h1>
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
                                {entregaSucursal
                                    ? (
                                        <div>
                                            {p.modalidadPago === 'efectivo'
                                                ? <h2>Cobrar al cliente ${p.total}</h2>
                                                : <h6>El pago del pedido ya fue efectuado correctamente!</h6>
                                            }
                                            <br />
                                            <Button variant="success" onClick={() => handleUpdateEstado(p.id, 'entregado')} >
                                                {p.modalidadPago === 'efectivo'
                                                    ? 'MARCAR COMO ENTREGADO Y COBRADO'
                                                    : 'MARCAR COMO ENTREGADO'
                                                }
                                            </Button>
                                        </div>
                                    )
                                    : (<>
                                        <Button variant="success" onClick={() => handleUpdateEstado(p.id, 'a_entregar')} size={"lg"} >
                                            MARCAR COMO PREPARADO
                                        </Button>
                                        <br /><br />
                                        <Button variant="danger" onClick={() => handleUpdateEstado(p.id, 'rechazado')} >
                                            RECHAZAR PEDIDO
                                        </Button>
                                    </>
                                    )}
                            </Card.Body>
                        </Card>
                    )
                    : <p>
                        <h3>No hay pedidos que cumplan con el criterio solicitado actualmente.</h3>
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