import React, { useState } from 'react';
import './styles.css';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

export default function ProductSmall({ addCombo, p, modoStock = false, updateStocks }) {
    const [stockActual, setStockActual] = useState(p.stockActual);
    const [stockMax, setStockMax] = useState(p.stockMax);
    const [stockMin, setStockMin] = useState(p.stockMin);

    const rojo = '#cd2b3ba3';
    const naranja = '#d37f00e6';
    const verde = '#2ab049ad';
    const classColor = (stockActual - stockMin < 2 ? rojo : stockActual - stockMin < 5 ? naranja : verde)

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
        <Card style={{ width: '20rem', height: 'fit-content', margin: "20px",
            backgroundColor: !modoStock ? 'white' : classColor }}>
            <Card.Img variant="top" src={p.fotos} style={{ width: '5rem', height: '5rem', margin: "auto" }} />
            <Card.Body>
                <Card.Title>{p.nombre} - {p.cantidad}</Card.Title>
                {
                    modoStock
                        ? <div>
                            <br />
                            <Form.Group controlId="formBasicStock">
                                <h6>Stock Actual</h6>
                                <Form.Control type="number" name="stockActual"
                                    onChange={(value) => setStockActual(Number.parseInt(value.target.value))}
                                    isInvalid={stockActual < 0 || stockActual > p.stockMax}
                                    defaultValue={stockActual}
                                    style={{ width: "120px", margin: "auto" }}
                                />
                                {stockActual < 0 && <Form.Text className="text-muted-personalized">
                                    El stock actual del producto no puede ser un número negativo
                                </Form.Text>}
                            </Form.Group>
                            <Form.Group controlId="formBasicStockMax">
                                <h6>Stock Máximo de Almacenamiento</h6>
                                <Form.Control type="number" name="stockMax"
                                    onChange={(value) => setStockMax(Number.parseInt(value.target.value))}
                                    isInvalid={stockMax < 0 || stockMax < stockMin}
                                    defaultValue={stockMax}
                                    style={{ width: "120px", margin: "auto" }}
                                />
                                {stockMax < 0 && <Form.Text className="text-muted-personalized">
                                    El stock máximo del producto no puede ser un número negativo
                                </Form.Text>}
                            </Form.Group>
                            <Form.Group controlId="formBasicStockMin">
                                <h6>Stock Mínimo disponible</h6>
                                <Form.Control type="number" name="stockMin"
                                    onChange={(value) => setStockMin(Number.parseInt(value.target.value))}
                                    isInvalid={stockMin < 0 || stockMin > stockMax}
                                    defaultValue={stockMin}
                                    style={{ width: "120px", margin: "auto" }}
                                />
                                {stockMin < 0 && <Form.Text className="text-muted-personalized">
                                    El stock mínimo del producto no puede ser un número negativo
                                </Form.Text>}
                            </Form.Group>
                            <br />
                            {/* <h5>Diferencia de stock entre actual y mínimo disponible: {stockDifference}</h5> */}
                            <br />
                            {/* {(stockActual > stockMin && stockMin < stockMax && stockActual < stockMax ) && */}
                            {(stockActual !== p.stockActual || stockMin !== p.stockMin || stockMax !== p.stockMax) &&
                                <Button variant="danger" 
                                    disabled={stockActual < stockMin && stockMin > stockMax && stockActual > stockMax }
                                    onClick={() => updateStocks(p, stockActual, stockMin, stockMax)}>
                                    ACTUALIZAR STOCK
                                </Button>
                            }
                        </div>
                        : <>
                            <Card.Text>${' ' + p.precio}</Card.Text>
                            <Button variant="dark" onClick={() => addCombo(p, 1)}>AGREGAR AL COMBO</Button>
                        </>
                }
            </Card.Body>
        </Card>
    )
}