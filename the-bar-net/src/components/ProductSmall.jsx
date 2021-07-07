import React, { useCallback, useState } from 'react';
import './styles.css';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';

export default function ProductSmall({ addCombo, p }) {
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
        <Card style={{ width: '20rem', height: 'fit-content', margin: "20px" }}>
            <Card.Img variant="top" src={p.fotos} style={{ width: '5rem', height: '5rem', margin: "auto" }} />
            <Card.Body>
                <Card.Title>{p.nombre} - {p.cantidad}</Card.Title>
                <Card.Text>${' ' + p.precio}</Card.Text>
                {/* <Form.Group controlId="formBasicCAnt">
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
                </Form.Group> */}
                <Button variant="dark" onClick={() => addCombo(p, cantidad)}>AGREGAR AL COMBO</Button>
            </Card.Body>
        </Card>
    )
}