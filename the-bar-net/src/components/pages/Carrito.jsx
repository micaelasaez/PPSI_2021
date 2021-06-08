import React, { useCallback, useContext, useEffect, useState } from 'react';
import { TheNetBar } from '../context/TheNetBarContext';
import '../styles.css';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';

export default function Carrito() {
    const [isLoading, setIsLoading] = useState(true);
    const [subTotal, setSubTotal] = useState(0);
    const { productosCarrito, setCarrito } = useContext(TheNetBar.Context);


    useEffect(() => {
        if (Array.isArray(productosCarrito) && productosCarrito.length > 0) {
            let total = 0;
            productosCarrito.forEach(e => {
                total += (e.cantidad * e.p.precio);
            });
            setSubTotal(total);
        }
    }, [productosCarrito]);

    /** productosCarrito ejemplo
        cantidad: 1,
        p: {
            StockMax: 120
            cantidad: "473 ml"
            fechaVencimiento: ""
            fotos: "https://d1on8qs0xdu5jz.cloudfront.net/webapp/images/fotos/b/0000000000/1321_1.jpg"
            nombre: "Pack cerveza Schneider "
            precio: 480
            stockActual: 98
            stockMin: 72
        }
    */

    const handleDelete = useCallback((pCarrito) => {
        const newProductosCarrito = productosCarrito.filter(p => p.p.nombre !== pCarrito.p.nombre);
        const newTotal = subTotal - (pCarrito.p.precio * pCarrito.cantidad);
        // console.log(newProductosCarrito, newTotal)
        setCarrito(newProductosCarrito, newTotal);
        setSubTotal(newTotal);
    }, [productosCarrito, setCarrito, subTotal]);

    return (
        <div style={{ height: "100vh" }}>
            <br /><h1 className="tittle-style">CARRITO DE COMPRAS</h1><br />
            <div style={{ display: 'flex', justifyContent: "space-around" }}>
                <div style={{ width: "65%" }}>
                    {/* <p>No hay productos en el carrito!</p> */}
                    <Table responsive>
                        <thead className="table-row-title">
                            <tr>
                                <th colspan="2">PRODUCTO</th> <th>PRECIO</th> <th>CANTIDAD</th> <th>SUBTOTAL</th>
                                <th>BORRAR</th>
                            </tr>
                        </thead>
                        <tbody>
                            {(Array.isArray(productosCarrito) && productosCarrito.length > 0)
                                && productosCarrito.map(pCarrito => {
                                    return <tr key={pCarrito.p.id} className="table-row">
                                        <td>
                                            <img src={pCarrito.p.fotos} style={{ width: '5rem', height: '5rem', margin: "auto" }} alt="" />
                                        </td>
                                        <td>
                                            {pCarrito.p.nombre}<br />{pCarrito.p.cantidad}
                                        </td>
                                        <td>$ {pCarrito.p.precio}</td>
                                        <td>{pCarrito.cantidad}</td>
                                        <td>$ {pCarrito.p.precio * pCarrito.cantidad}</td>
                                        <td>
                                            <Button variant="danger" size="sm" onClick={() => handleDelete(pCarrito)}>
                                                X
                                            </Button>
                                        </td>
                                    </tr>
                                })
                            }
                        </tbody>
                    </Table>
                </div>
                <Card style={{ width: '20%', height: "250px" }}>
                    <Card.Body>
                        <Card.Title style={{ color: "black" }}>Total del Carrito</Card.Title>
                        <br />
                        <Card.Text>
                            Subtotal ${' ' + subTotal}
                        </Card.Text>
                        <br />
                        <Button className="personalized-button" onClick={() => console.log('end')}>
                            FINALIZAR COMPRA
                        </Button>
                    </Card.Body>
                </Card>
            </div>
        </div>
    )
}