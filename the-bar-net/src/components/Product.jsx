import React, { useState } from 'react';
import './styles.css';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

export default function Product({ addCarrito, p }) {
    const [cantidad, setCantidad] = useState(1);

    /* ejemplo producto
    StockMax: 53
    cantidad: " 473 ml"
    fechaVencimiento: ""
    fotos: "https://statics.dinoonline.com.ar/imagenes/full_600x600_ma/3100659_f.jpg"
    nombre: "Pack Cerveza Patagonia Weisse"
    precio: 700
    stockActual: 42
    stockMin: 30*/

    return (
        <Card style={{ width: '20rem', height: '35rem', margin: "20px" }}>
            <Card.Img variant="top" src={p.fotos} style={{ width: '15rem', height: '15rem', margin: "auto" }}/>
            <Card.Body>
                <Card.Title>{p.nombre} - {p.cantidad}</Card.Title>
                <Card.Text>
                    {p.oldPrice && <span style={{ textDecoration: 'line-through', marginRight: '30px' }}>${' ' + p.oldPrice}</span>}
                    ${' ' + p.precio}
                </Card.Text>
                <Form.Group controlId="formBasicCAnt">
                    <Form.Control type="number" name="cantidad"
                        onChange={(value) => setCantidad(Number.parseInt(value.target.value))} 
                        isInvalid={cantidad < 1 || cantidad > p.stockActual} 
                        defaultValue={cantidad} 
                        style={{ width: "90px", margin: "auto" }}
                    />
                    {cantidad > p.stockActual && <Form.Text className="text-muted-personalized">
                        Disculpe, no contamos con ese stock disponible!
                    </Form.Text>}
                    {cantidad < 1 && <Form.Text className="text-muted-personalized">
                        Ingrese un número válido como cantidad!
                    </Form.Text>}
                </Form.Group>
                <Button variant="dark" onClick={() => addCarrito(p, cantidad)}>AGREGAR AL CARRITO</Button>
            </Card.Body>
        </Card>
    )
}