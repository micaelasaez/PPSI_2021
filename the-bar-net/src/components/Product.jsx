import React, { useCallback, useState } from 'react';
import './styles.css';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';

export default function Product({ addCarrito, p, modoOferta, handleSubmitOferta, adminMode = false, handleDeleteOferta, handleUpdateOferta }) {
    const todayDate = new Date().toJSON().slice(0, 10).replace(/-/g, '-');
    const [cantidad, setCantidad] = useState(1);
    const [fechaInicio, setFechaInicio] = useState(todayDate);
    const [fechaFin, setFechaFin] = useState(adminMode ? p.fechaFin : "");
    const [nuevoPrecio, setNuevoPrecio] = useState(0);

    /* ejemplo producto
    StockMax: 53
    cantidad: " 473 ml"
    fechaVencimiento: ""
    fotos: "https://statics.dinoonline.com.ar/imagenes/full_600x600_ma/3100659_f.jpg"
    nombre: "Pack Cerveza Patagonia Weisse"
    precio: 700
    stockActual: 42
    stockMin: 30*/

    const nuevoPrecioValid = nuevoPrecio > 0;
    const fechaInicioValid = true;
    // const fechaInicioValid = fechaInicio !== null;
    // const fechaFinValid = fechaFin !== null;
    const fechaFinValid = true;

    const handleChange = useCallback((value) => {
        switch (value.target.id) {
            case "nuevoPrecio":
                setNuevoPrecio(value.target.value);
                break;
            case "date-inicio":
                setFechaInicio(value.target.value);
                break;
            case "date-fin":
                setFechaFin(value.target.value);
                break;
            default:
                break;
        }
    }, []);


    return (
        <Card style={{ width: '20rem', height: 'fit-content', margin: "20px" }}>
            <Card.Img variant="top" src={p.fotos} style={{ width: '15rem', height: '15rem', margin: "auto" }} />
            <Card.Body>
                <Card.Title>{p.nombre} - {p.cantidad}</Card.Title>
                <Card.Text>
                    {p.nuevoPrecio
                        ? <><span style={{ textDecoration: 'line-through', marginRight: '30px' }}>${' ' + p.precio}</span>
                            ${' ' + p.nuevoPrecio}
                            <br />
                            <br />
                            <p style={{ color: '#4c2882' }}>Descuento total: ${p.precio - p.nuevoPrecio}</p>
                        </>
                        : <> ${' ' + p.precio} </>
                    }
                </Card.Text>
                {!modoOferta
                    ? adminMode
                        ? <div>
                            <h3>Stock Actual: {p.stockActual}</h3><br />
                            <Form.Group controlId="fechaInicio">
                                <Form.Label className="login-form-tittles" style={{ color: 'black' }}>Fecha de Inicio Oferta</Form.Label>
                                <input type="date" id="date-inicio" name="date" value={p.fechaInicio} disabled />
                                {/* min={todayDate}
                                    onChange={handleChange} disabled /> */}
                                {/* {(fechaInicio === todayDate || fechaInicio === '') && <Form.Text className="text-muted-personalized">
                                Seleccione la fecha de inicio.
                            </Form.Text>} */}
                            </Form.Group>
                            <Form.Group controlId="formBasicCode">
                                <Form.Label className="login-form-tittles" style={{ color: 'black' }}>Fecha de Fin de Oferta</Form.Label>
                                <input type="date" id="date-fin" name="date" value={p.fechaInicio} disabled />
                                {/* {(fechaFin === fechaInicio || fechaFin === '') && <Form.Text className="text-muted-personalized">
                                    Seleccione la fecha de fin de oferta.
                                </Form.Text>} */}
                            </Form.Group>

                            <Button variant="danger" onClick={() => handleDeleteOferta(p)}>
                                {/* disabled={!(fechaFinValid && fechaInicioValid && nuevoPrecioValid)}> */}
                                BORRAR OFERTA
                            </Button>
                            {/* <Button variant="dark" onClick={() => handleUpdateOferta(p)}
                                disabled={!fechaFinValid}>
                                GUARDAR OFERTA
                            </Button> */}
                        </div>
                        : <>
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
                        </>
                    : <div><br />
                        <h3>Stock Actual: {p.stockActual}</h3><br />
                        <Form.Group key='newPrecio' style={{ width: '225px', margin: 'auto' }}>
                            <Form.Label>Ingrese nuevo precio</Form.Label>
                            <InputGroup>
                                <InputGroup.Prepend><InputGroup.Text>$</InputGroup.Text></InputGroup.Prepend>
                                <Form.Control
                                    type="number" id="nuevoPrecio"
                                    placeholder='Ingrese nuevo Precio'
                                    onChange={handleChange}
                                    isValid={nuevoPrecio > 0}
                                />
                            </InputGroup>
                            {nuevoPrecio > 0 && <p>Descuento total: ${p.precio - nuevoPrecio}</p>}
                        </Form.Group>
                        <Form.Group controlId="fechaInicio">
                            <Form.Label className="login-form-tittles">Fecha de Inicio Oferta</Form.Label>
                            <input type="date" id="date-inicio" name="date" value={fechaInicio} min={todayDate} onChange={handleChange} />
                            {/* {(fechaInicio === todayDate || fechaInicio === '') && <Form.Text className="text-muted-personalized">
                                Seleccione la fecha de inicio.
                            </Form.Text>} */}
                        </Form.Group>
                        <Form.Group controlId="formBasicCode">
                            <Form.Label className="login-form-tittles">Fecha de Fin de Oferta</Form.Label>
                            <input type="date" id="date-fin" name="date" value={fechaFin} min={fechaInicio} onChange={handleChange} />
                            {(fechaFin === fechaInicio || fechaFin === '') && <Form.Text className="text-muted-personalized">
                                Seleccione la fecha de fin de oferta.
                            </Form.Text>}
                        </Form.Group>

                        <Button variant="dark" onClick={() => handleSubmitOferta(p, nuevoPrecio, fechaInicio, fechaFin)}
                            disabled={!(fechaFinValid && fechaInicioValid && nuevoPrecioValid)}>
                            GUARDAR OFERTA
                        </Button>
                    </div>
                }
            </Card.Body>
        </Card>
    )
}