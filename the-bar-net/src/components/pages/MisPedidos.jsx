import React, { useEffect } from 'react';
import { useContext } from 'react';
import { TheNetBar } from '../context/TheNetBarContext';
import '../styles.css';
import Card from 'react-bootstrap/Card';
import { modalidadEnvio, modalidadPago } from './FinalizarCompra';
import { TheBarNetServerUrl } from '../context/Url';
import { useState } from 'react';
import Table from 'react-bootstrap/Table';

export const estadosPedido = [
    { key: 'sin_pagar', title: 'No fue pagado todavía' },
    { key: 'pagado', title: 'El pago fue registrado, se encuentra en preparación' },
    { key: 'a_entregar', title: 'Su pedido está listo para ser entregado' },
    { key: 'en_camino', title: 'Su pedido se encuentra en camino' },
    { key: 'entregado', title: 'Este pedido ya fue entregado' },
    { key: 'cancelado', title: 'Este pedido fue cancelado' },
    { key: 'rechazado', title: 'Este pedido fue rechazado' }
];

export const MisPedidos = () => {
    const { productosCarrito, user, pedido } = useContext(TheNetBar.Context);
    const [pedidos, setPedidos] = useState([]);

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
                    setPedidos(response.rta);
                    // setPedidos([
                    //     {"id":24,"fecha":"2021-6-27 0:8:19","total":2480,"tipoEnvio":"retiro","modalidadPago":"efectivo","estado":"sin_pagar"},
                    //     {"id":24,"fecha":"2021-6-27 0:8:19","total":2480,"tipoEnvio":"retiro","modalidadPago":"efectivo","estado":"entregado"},
                    //     {"id":24,"fecha":"2021-6-27 0:8:19","total":2480,"tipoEnvio":"retiro","modalidadPago":"efectivo","estado":"en_camino"}
                    // ])
                })
        }
    }, [user]);

    const pedidoMasReciente = pedido => (
        <Card style={{ width: '35%', height: "fit-content" }} className="card-style" >
            <Card.Body>
                <Card.Title>
                    <h5>TU PEDIDO MÁS RECIENTE</h5>
                </Card.Title>
                <br />
                {(Array.isArray(productosCarrito) && productosCarrito.length > 0) &&
                    productosCarrito.map(pCarrito =>
                        <p>
                            {pCarrito.p.nombre} - {pCarrito.p.cantidad}
                            <br />{pCarrito.cantidad} x $ {pCarrito.p.precio}
                            <hr />
                        </p>
                    )
                }
                <Card.Text>
                    Subtotal ${' ' + pedido.total}
                </Card.Text>
                <hr />
                <Card.Text>
                    Modalidad de pago elegida: {' ' + (modalidadPago.find(mp => mp.id === pedido.modalidadPago)).name}
                </Card.Text>
                <hr />
                <Card.Text>
                    Modalidad de envío elegida: {' ' + (modalidadEnvio.find(mE => mE.id === pedido.tipoEnvio)).name}
                </Card.Text>
                <hr />
                <Card.Text>
                    Estado del pedido: {' ' + (estadosPedido.find(eP => eP.key === pedido.estado)).title}
                    {pedido.modalidadPago === 'efectivo' && pedido.estado === 'sin_pagar' && pedido.tipoEnvio === 'retiro'
                        ? <><br />Listo para retirar por sucursal</>
                        : ""}
                </Card.Text>
            </Card.Body>
        </Card>
    )

    return (
        <div>
            <div className="tittle-style">Mis Pedidos</div>
            <br />
            <div style={{ display: 'flex', justifyContent: 'space-around' }}>
                {(Array.isArray(pedidos) && pedidos.length > 0) && pedidoMasReciente(pedido.idUsuario ? pedido : pedidos[pedidos.length -1])}
                {(Array.isArray(pedidos) && pedidos.length > 0) &&
                    <div style={{ width: '60%' }}>
                        <Table responsive>
                            <thead>
                                <tr>
                                    <th>Fecha</th> <th>Total</th> <th>Tipo de Envío</th> <th>Modalidad de Pago</th> <th>Estado del Pedido</th>
                                </tr>
                            </thead>
                            <tbody>
                                {(Array.isArray(pedidos) && pedidos.length > 0)
                                    && pedidos.map(p => {
                                        return <tr key={p.id} className="table-row">
                                            <td>{p.fecha}</td>
                                            <td>{p.total}</td>
                                            <td>{(modalidadEnvio.find(mEnvio => mEnvio.id === p.tipoEnvio)).name}</td>
                                            <td>{(modalidadPago.find(mPago => mPago.id === p.modalidadPago)).name}</td>
                                            <td>{(estadosPedido.find(e => e.key === p.estado)).title}</td>
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
        </div>
    )
}