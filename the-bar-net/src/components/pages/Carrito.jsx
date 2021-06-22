import React, { useCallback, useContext, useEffect, useState } from 'react';
import { TheNetBar } from '../context/TheNetBarContext';
import '../styles.css';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import { useHistory } from 'react-router-dom';

export default function Carrito() {
    const [isCorrect, setIsCorrect] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [subTotal, setSubTotal] = useState(0);
    const { productosCarrito, setCarrito, setCarritoTotal, isLogged } = useContext(TheNetBar.Context);
    const history = useHistory();

    useEffect(() => {
        if (Array.isArray(productosCarrito) && productosCarrito.length > 0) {
            let total = 0;
            productosCarrito.forEach(e => {
                total += (e.cantidad * e.p.precio);
            });
            let isCorrect = true;
            productosCarrito.forEach(p => {
                if (p.cantidad < 1 || p.cantidad > p.p.stockActual) {
                    isCorrect = false;
                }
            });
            setSubTotal(total);
            setCarritoTotal(total);
            setIsCorrect(isCorrect);
        }
    }, [productosCarrito, setCarritoTotal, setIsCorrect]);

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

    const updateCantidad = useCallback((value, pCarrito) => {
        const cantidad = Number.parseInt(value.target.value);
        const productoIndex = productosCarrito.findIndex(p => p.p.nombre === pCarrito.p.nombre);
        const arrProductosUpdated = [...productosCarrito];
        arrProductosUpdated[productoIndex] = { ...arrProductosUpdated[productoIndex], cantidad: cantidad };
        setCarrito(arrProductosUpdated, subTotal);
        console.log(cantidad, pCarrito);
    }, [productosCarrito, setCarrito, subTotal]);

    const handleFinalizarCompra = useCallback(() => {
        // console.log('end', productosCarrito)
        isLogged !== null 
            ? history.push('/finalizar-compra')
            : setShowModal(true)
    }, [history, isLogged]);

    return (
        <div style={{ height: "100vh" }}>
            <br /><h1 className="tittle-style">CARRITO DE COMPRAS</h1><br />
            <div style={{ display: 'flex', justifyContent: "space-around" }}>
                <div style={{ width: "65%" }}>
                    {(Array.isArray(productosCarrito) && productosCarrito.length > 0)
                        ? <Table responsive>
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
                                            <td>{pCarrito.p.nombre}<br />{pCarrito.p.cantidad}</td>
                                            <td>$ {pCarrito.p.precio}</td>
                                            <td>
                                                <Form.Group controlId="formBasicCAnt">
                                                    <Form.Control type="number" name="cantidad"
                                                        onChange={(value) => updateCantidad(value, pCarrito)}
                                                        isInvalid={pCarrito.cantidad < 1 || pCarrito.cantidad > pCarrito.p.stockActual}
                                                        defaultValue={pCarrito.cantidad}
                                                        style={{ width: "90px", margin: "auto" }}
                                                    />
                                                    {pCarrito.cantidad > pCarrito.p.stockActual && <Form.Text className="text-muted-personalized">
                                                        Disculpe, no contamos con ese stock disponible!
                                                    </Form.Text>}
                                                    {pCarrito.cantidad < 1 && <Form.Text className="text-muted-personalized">
                                                        Ingrese un número válido como cantidad!
                                                    </Form.Text>}
                                                </Form.Group>
                                            </td>
                                            <td>$ {pCarrito.p.precio * pCarrito.cantidad}</td>
                                            <td>
                                                <Button variant="danger" size="sm" onClick={() => handleDelete(pCarrito)}>
                                                    X
                                                </Button>
                                            </td>
                                        </tr>
                                    })}
                            </tbody>
                        </Table>
                        : <p>No hay productos en el carrito!</p>
                    }
                </div>
                <Card style={{ width: '20%', height: "250px" }}>
                    <Card.Body>
                        <Card.Title style={{ color: "black" }}>Total del Carrito</Card.Title>
                        <br />
                        <Card.Text>
                            Subtotal ${' ' + subTotal}
                        </Card.Text>
                        <br />
                        <Button
                            className="personalized-button"
                            onClick={handleFinalizarCompra}
                            disabled={productosCarrito.length < 1 || !isCorrect}
                        >
                            FINALIZAR COMPRA
                        </Button>
                    </Card.Body>
                </Card>
            </div>
            <Modal show={showModal}>
                <Modal.Header>
                    <Modal.Title>Alerta</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>No ha iniciado sesión.</p>
                </Modal.Body>
                <Modal.Footer style={{ display: 'flex', justifyContent: 'space-around' }}>
                    <Button variant="danger" onClick={() => history.push('/sign-up')}>No tengo Cuenta</Button>
                    <Button variant="primary" onClick={() => history.push('/login')}>
                        Iniciar Sesión
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    )
}