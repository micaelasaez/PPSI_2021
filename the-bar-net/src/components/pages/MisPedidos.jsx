import React, { useEffect } from 'react';
import { useContext } from 'react';
import { TheNetBar } from '../context/TheNetBarContext';
import '../styles.css';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Figure from 'react-bootstrap/Figure';
import Modal from 'react-bootstrap/Modal';
import { modalidadEnvio, modalidadPago } from './FinalizarCompra';
import { TheBarNetServerUrl } from '../context/Url';
import { useState } from 'react';
import Table from 'react-bootstrap/Table';
import deleteIcon from "../../utils/images/delete-photo.svg";
import { useCallback } from 'react';

export const estadosPedido = [
    { key: 'sin_pagar', name: 'Sin pagar', title: 'Pago pendiente, su pedido se encuentra en preparación' },
    { key: 'pagado', name: 'Pago efectuado', title: 'El pago fue registrado, se encuentra en preparación' },
    { key: 'a_entregar', name: 'Listo para entregar', title: 'Su pedido está listo para ser entregado' },
    { key: 'a_enviar', name: 'Listo para enviar', title: 'Su pedido está en manos del repartidor' },
    { key: 'en_camino', name: 'En camino', title: 'Su pedido se encuentra en camino' },
    { key: 'entregado', name: 'Entregado', title: 'Este pedido ya fue entregado' },
    { key: 'cancelado', name: 'Cancelado', title: 'Este pedido fue cancelado' },
    { key: 'rechazado', name: 'Rechazado', title: 'Este pedido fue rechazado por The Bar Net' }
];

export const MisPedidos = () => {
    const { productosCarrito, user, pedido } = useContext(TheNetBar.Context);
    const [pedidos, setPedidos] = useState([]);

    const [showAlert, setShowAlert] = useState(false);
    const [alertMsg, setAlertMsg] = useState('');

    // pedido
    // {"idUsuario":24,"fecha":"2021-6-27 0:8:19","total":2480,"tipoEnvio":"retiro","modalidadPago":"efectivo","estado":"sin_pagar"}

    // estado: "pagado"
    // fecha: "2021-6-27 1:17:16"
    // id: 11
    // modalidadPago: "credito"
    // tipoEnvio: "retiro"
    // total: 1570

    useEffect(() => {
        if (user.id) {
            fetch(TheBarNetServerUrl.pedidosUsuario + user.id, {
                mode: 'cors'
            }).then(res => res.json())
                .then(response => {
                    console.log(response.rta)
                    setPedidos(response.rta);
                })
        }
    }, [user]);

    const showProdsPed = useCallback((pedido) => {
        // console.log('prods', pedido.id)
        fetch(TheBarNetServerUrl.productoPedido + `/${pedido.id}`, {
            mode: 'cors'
        })
            .then(res => res.json())
            .then(response => {
                if (response.rta.length > 0) {
                    const productos = response.rta.map(r => r[0]);
                    // console.log(productos);
                    const prodsToShow = [];
                    productos.forEach(prod => {
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
                    const content = <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-around' }}>
                        {prodsToShow.map(p => (
                            <Card style={{ width: '20rem', height: 'fit-content', marginTop: '10px' }} key={p.id}>
                                <Card.Img variant="top" src={p.prod.fotos}
                                    style={{ width: '5rem', height: '5rem', margin: "auto" }} />
                                <Card.Body>
                                    <Card.Title>{p.prod.nombre} - {p.prod.cantidad}</Card.Title>
                                    <Card.Title>Cant. unidades: {p.cantidad}</Card.Title>
                                </Card.Body>
                            </Card>
                        ))}
                    </div>;
                    setAlertMsg(content);
                    setShowAlert(true);
                }
            });
    }, []);

    const pedidoMasReciente = pedido => (
        <Card style={{ width: '35%', height: "fit-content" }} className="card-style">
            <Card.Body onClick={() => showProdsPed(pedido)}>
                <Card.Title>
                    <h5>TU PEDIDO MÁS RECIENTE</h5>
                </Card.Title>
                <br />
                <Card.Text>
                    <b>Estado del pedido:</b> {' ' + (estadosPedido.find(eP => eP.key === pedido.estado)).title}
                    {/* {pedido.modalidadPago === 'efectivo' && pedido.estado === 'sin_pagar' && pedido.tipoEnvio === 'retiro'
                        ? <><br />Listo para retirar por sucursal</>
                        : ""} */}
                </Card.Text>
                <hr />
                <Card.Text>
                    <b>Subtotal:</b> ${' ' + pedido.total}
                </Card.Text>
                <hr />
                <Card.Text>
                    <b>Modalidad de pago elegida:</b> {' ' + (modalidadPago.find(mp => mp.id === pedido.modalidadPago)).name}
                </Card.Text>
                <hr />
                <Card.Text>
                    <b>Modalidad de envío elegida:</b> {' ' + (modalidadEnvio.find(mE => mE.id === pedido.tipoEnvio)).name}
                </Card.Text>
                <hr />
            </Card.Body>
            <Card.Text>
                <Button variant='danger' onClick={() => handleCancele(pedido)} size='sm'>
                    <div>CANCELAR PEDIDO</div>
                    <Figure.Image
                        width={20}
                        height={20}
                        alt="171x180"
                        src={deleteIcon}
                    />
                </Button>
            </Card.Text>
            <br />
        </Card>
    )

    const handleCancele = useCallback((pedido) => {
        console.log('cancele', pedido.id)
        fetch(TheBarNetServerUrl.pedido + `/${pedido.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            mode: 'cors', // no-cors
            body: JSON.stringify({
                estado: 'cancelado'
            })
        }).then(res => res.json())
            .then(response => {
                console.log(response);
                const index = pedidos.findIndex(p => p.id === pedido.id);
                pedidos[index].estado = 'cancelado';
                setPedidos(pedidos);
                setAlertMsg('El pedido fue cancelado correctamente!');
                setShowAlert(true);
            })
            .catch(() => {
                setAlertMsg('Algo falló modificando el estado del pedido!');
                setShowAlert(true);
            });
    }, [pedidos]);

    return (
        <div>
            <div className="tittle-style">Mis Pedidos</div>
            {pedidos.length > 0 && <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <h5 style={{ marginLeft: '55%' }}>Seleccione un pedido para ver sus productos.</h5>
                <Button variant='success' onClick={() => window.location.reload()} size='sm' style={{ marginRight: '35px' }}>
                    ACTUALIZAR
                </Button>
            </div>}
            <br />
            <br />
            <div style={{ display: 'flex', justifyContent: 'space-around' }}>
                {(Array.isArray(pedidos) && pedidos.length > 0) &&
                    pedidoMasReciente(pedido.idUsuario ? pedido : pedidos[pedidos.length - 1])}
                {(Array.isArray(pedidos) && pedidos.length > 1) &&
                    <div style={{ width: '60%' }}>
                        <p><b>Los pedidos con modalidad de envío a domicilio sólo se pueden cancelar antes de que sean enviados.</b></p>
                        <Table responsive>
                            <thead>
                                <tr>
                                    <th>Fecha</th>
                                    <th>Total</th>
                                    <th>Tipo de Envío</th>
                                    <th>Modalidad de Pago</th>
                                    <th>Estado del Pedido</th>
                                    <th>Cancelar Pedido</th>
                                </tr>
                            </thead>
                            <tbody>
                                {(Array.isArray(pedidos) && pedidos.length > 0)
                                    && pedidos.map((value, index) => {
                                        if (pedido.idUsuario) {
                                            return <></>;
                                        }
                                        if (index === pedidos.length -1) {
                                            return <></>;
                                        }
                                        return <tr key={value.id} className="table-row">
                                            <td onClick={() => showProdsPed(value)}>
                                                {value.fecha}
                                            </td>
                                            <td onClick={() => showProdsPed(value)}>
                                                ${value.total}
                                            </td>
                                            <td onClick={() => showProdsPed(value)}>
                                                {(modalidadEnvio.find(mEnvio => mEnvio.id === value.tipoEnvio)).name}
                                            </td>
                                            <td onClick={() => showProdsPed(value)}>
                                                {(modalidadPago.find(mPago => mPago.id === value.modalidadPago)).name}
                                            </td>
                                            <td onClick={() => showProdsPed(value)}>
                                                {(estadosPedido.find(e => e.key === value.estado)).title}
                                            </td>
                                            <td>
                                                {
                                                    (value.estado === 'sin_pagar' ||
                                                        value.estado === 'pagado' ||
                                                        value.estado === 'a_entregar' ||
                                                        value.estado === 'a_enviar') && (
                                                        <Button variant='danger' onClick={() => handleCancele(value)} size='sm'>
                                                            <div>CANCELAR</div>
                                                            <Figure.Image
                                                                width={20}
                                                                height={20}
                                                                alt="171x180"
                                                                src={deleteIcon}
                                                            />
                                                        </Button>
                                                    )
                                                }
                                            </td>
                                        </tr>
                                    })
                                }
                            </tbody>
                        </Table>
                    </div>
                }
            </div>
            {
                (pedido.idUsuario === undefined && (Array.isArray(pedidos) && pedidos.length < 1)) &&
                <h3>No hay pedidos para mostrar!</h3>
            }
            <Modal show={showAlert} onHide={() => setShowAlert(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Productos del pedido</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {/* alert msg shows products on pedido */}
                    {alertMsg}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={() => { setShowAlert(false); }}>
                        Volver
                    </Button>
                </Modal.Footer>
            </Modal>
            <br /><br /><br /><br /><br />
        </div>
    )
}