import React from 'react';
import { useContext } from 'react';
import { TheNetBar } from '../context/TheNetBarContext';
import '../styles.css';
import Card from 'react-bootstrap/Card';
import { modalidadEnvio, modalidadPago } from './FinalizarCompra';

const estadosPedido = [
    { key: 'sin_pagar', title: 'No fue pagado todavía' },
    { key: 'pagado', title: 'El pago fue registrado, se encuentra en preparación' },
    { key: 'a_entregar', title: 'Su pedido está listo para ser entregado' },
    { key: 'en_camino', title: 'Su pedido se encuentra en camino' },
    { key: 'entregado', title: 'Este pedido ya fue entregado' },
    { key: 'cancelado', title: 'Este pedido fue cancelado' },
    { key: 'rechazado', title: 'Este pedido fue rechazado' }
];

export const MisPedidos = () => {
    const { productosCarrito, user, carritoTotal, pedido } = useContext(TheNetBar.Context);

    return (
        <div>
            <h1>Mis Pedidos</h1>
            {JSON.stringify(pedido)}
            <Card style={{
                width: '100%',
                height: "fit-content",
                // marginTop: '50px'
                backgroundColor: '#8b7b97'
            }}>
                <Card.Body>
                    <Card.Title>
                        <h5>Tu Pedido</h5>
                    </Card.Title>
                    <br />
                    {productosCarrito.map(pCarrito =>
                        <p>
                            {pCarrito.p.nombre} - {pCarrito.p.cantidad}
                            <br />{pCarrito.cantidad} x $ {pCarrito.p.precio}
                            <hr />
                        </p>
                    )}
                    <br />
                    <Card.Text>
                        Subtotal ${' ' + carritoTotal}
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
                    </Card.Text>
                </Card.Body>
            </Card>
        </div>
    )
}