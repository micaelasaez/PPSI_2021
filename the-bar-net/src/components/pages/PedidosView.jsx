import React, { useCallback, useEffect, useState } from 'react';
import '../styles.css';
import { TheBarNetServerUrl } from '../context/Url';
import Form from 'react-bootstrap/Form';
import { estadosPedido } from './MisPedidos';
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

export default function PedidosView() {
    const [pedidos, setPedidos] = useState([]);
    const [pedidosToShow, setPedidosToShow] = useState([]);
    const [estadoSelected, setEstadoSelected] = useState(estadosPedido[0].key);

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
            fetch(TheBarNetServerUrl.users + `/${pedido.idUsuario}`, {
                mode: 'cors'
            })
                .then(res => res.json())
                .then(response => {
                    const user = response.rta[0];
                    const newPedidoToShow = {
                        ...pedido, usuario: user, showProds: false, productos: [
                            {
                                stockMax: 53,
                                cantidad: " 473 ml",
                                fechaVencimiento: "",
                                fotos: "https://statics.dinoonline.com.ar/imagenes/full_600x600_ma/3100659_f.jpg",
                                nombre: "Pack Cerveza Patagonia Weisse",
                                precio: 700,
                                stockActual: 42,
                                stockMin: 30
                            },
                            {
                                stockMax: 53,
                                cantidad: " 473 ml",
                                fechaVencimiento: "",
                                fotos: "https://statics.dinoonline.com.ar/imagenes/full_600x600_ma/3100659_f.jpg",
                                nombre: "Pack Cerveza Patagonia Weisse",
                                precio: 700,
                                stockActual: 42,
                                stockMin: 30
                            }, {
                                stockMax: 53,
                                cantidad: " 473 ml",
                                fechaVencimiento: "",
                                fotos: "https://statics.dinoonline.com.ar/imagenes/full_600x600_ma/3100659_f.jpg",
                                nombre: "Pack Cerveza Patagonia Weisse",
                                precio: 700,
                                stockActual: 42,
                                stockMin: 30
                            }
                        ]
                    };
                    // fetch(TheBarNetServerUrl.productoPedido + `/${pedido.id}`, {
                    //     mode: 'cors'
                    // })
                    //     .then(res => res.json())
                    //     .then(response => {
                    //         console.log(response);
                    //         pedidosToShow[index].productos = response.rta;
                    //         setPedidosToShow(pedidosToShow);
                    //     });
                    setPedidosToShow(p => [...p, newPedidoToShow]);
                })
                .catch(() => {
                    setPedidosToShow([]);
                })
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
    stockMin: 30*/

    const handleChange = useCallback((value) => {
        switch (value.target.id) {
            case "type":
                setEstadoSelected(value.target.value);
                break;
            default:
                break;
        }
    }, []);

    const handleUpdateEstado = useCallback((value, pedido) => {
        console.log(value.target.value, pedido);
        fetch(TheBarNetServerUrl.pedido + `/${pedido.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            mode: 'cors', // no-cors
            body: JSON.stringify({
                estado: value.target.value
            })
        }).then(res => res.json())
            .then(response => {
                console.log(response);
                const index = pedidosToShow.findIndex(p => p.id === pedido.id);
                pedidosToShow[index].estado = value.target.value;
                setPedidosToShow(pedidosToShow);
                setAlertMsg('Estado del pedido modificado correctamente!');
                setShowAlert(true);
            })
            .catch(() => {
                setAlertMsg('Algo falló modificando el estado del pedido!');
                setShowAlert(true);
            });
    }, [pedidosToShow]);

    return (
        <div>
            <h1 className="tittle-style" style={styles.title}>PEDIDOS REALIZADOS</h1>
            <Form.Group style={{ width: '60%', margin: 'auto' }}>
                <Form.Label><h5>Filtrar por estado del pedido</h5></Form.Label>
                <Form.Control as="select" onChange={handleChange} id="type">
                    {estadosPedido.map(estado => (
                        <option key={estado.key} value={estado.key}>{estado.name}</option>
                    ))}
                </Form.Control>
            </Form.Group>
            <div style={styles.product}>
                {pedidosToShow.length > 0
                    ? pedidosToShow.map(p =>
                        p.estado === estadoSelected
                            ? <Card style={{ width: '700px', height: 'fit-content', margin: "20px" }} key={p.id}>
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
                                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                            <span>Estado del pedido:</span>
                                            {/* <span>{(estadosPedido.find(pe => pe.key === p.estado))?.name}</span> */}
                                            <Form.Control as="select" onChange={(value) => handleUpdateEstado(value, p)} id="type"
                                                style={{ width: '200px' }}>
                                                {estadosPedido.map(e => (
                                                    e.key === p.estado
                                                        ? <option key={e.key} value={e.key} selected>{e.name}</option>
                                                        : <option key={e.key} value={e.key}>{e.name}</option>
                                                ))}
                                            </Form.Control>
                                        </div>
                                    </div>
                                    <br />
                                    {<div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-around' }}>
                                        {
                                            p.productos.map(prod => (
                                                <Card style={{ width: '20rem', height: 'fit-content', marginTop: '10px' }}>
                                                    <Card.Img variant="top" src={prod.fotos}
                                                        style={{ width: '5rem', height: '5rem', margin: "auto" }} />
                                                    <Card.Body>
                                                        <Card.Title>{prod.nombre} - {prod.cantidad}</Card.Title>
                                                        <Card.Title>unidades: {prod.cantidad}</Card.Title>
                                                    </Card.Body>
                                                </Card>
                                            ))
                                        }
                                    </div>}
                                </Card.Body>
                            </Card>
                            : <></>
                    )
                    : <p>
                        <h3>Disculpe, no hay pedidos actualmente!</h3>
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