import React, { useCallback, useEffect, useState } from 'react';
import './styles.css';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import { TheBarNetServerUrl } from './context/Url';
import Button from 'react-bootstrap/Button';
/* ejemplo combo

    fechaFin: "14/9/2021"
    fechaInicio: "3/7/2021"
    foto: ""
    id: 2
    precio: 800
    productos: [
        { cantidad: 2, idProducto: 6 },
        { cantidad: 1, idProducto: 9 }
    ]
*/
export default function ProductCombo({ combo, setNombreCombo, editMode = false, handleUpdateCombo }) {
    const [productosCombo, setProductosCombo] = useState([]);
    // const [cantidad, setCantidad] = useState(1);

    // const todayDate = new Date().toJSON().slice(0, 10).replace(/-/g, '-');
    // const [fechaInicio, setFechaInicio] = useState('');
    const [fechaFin, setFechaFin] = useState("");
    const [nuevoPrecio, setNuevoPrecio] = useState(0);

    /* ejemplo producto
    StockMax: 53
    cantidad: " 473 ml"
    fechaVencimiento: ""
    fotos: "https://statics.dinoonline.com.ar/imagenes/full_600x600_ma/3100659_f.jpg"
    nombre: "Pack Cerveza Patagonia Weisse"
    precio: 700
    stockActual: 42
    stockMin: 30
    categoria: "vinos"
    */
    const handleClick = useCallback((combo) => {
        if (handleUpdateCombo) {
            handleUpdateCombo(combo, nuevoPrecio, fechaFin);
        }
    }, [fechaFin, handleUpdateCombo, nuevoPrecio]);

    const handleChange = useCallback((value) => {
        switch (value.target.id) {
            case "nuevoPrecio":
                setNuevoPrecio(value.target.value);
                break;
            // case "date-inicio":
            //     setFechaInicio(value.target.value);
            //     break;
            case "date-fin":
                setFechaFin(value.target.value);
                break;
            default:
                break;
        }
    }, []);

    useEffect(() => {
        if (combo.productos.length > 0) {
            combo.productos.forEach(prod => {
                // console.log('p', prod)
                fetch(TheBarNetServerUrl.products + `/${prod.idProducto}`, {
                    mode: 'cors'
                })
                    .then(res => res.json())
                    .then(response => {
                        console.log('rta', response)
                        let producto = response.rta[0];
                        // console.log(prod.idProducto, producto)
                        producto.id = prod.idProducto;
                        setProductosCombo(prod => [...prod, producto]);
                    })
            });
        }
    }, [combo]);

    useEffect(() => {
        if (productosCombo.length > 0) {
            let nombreCombo = `COMBO ${combo.id}: `;
            productosCombo.forEach(pCombo => {
                nombreCombo += `${pCombo.nombre} - ${pCombo.cantidad} / `;
            });
            setNombreCombo(nombreCombo)
        }
    }, [combo.id, productosCombo, setNombreCombo]);


    return (
        productosCombo.length > 0
            ? <>
                <Card style={{ width: 'fit-content', height: 'fit-content', margin: "20px", display: 'wrap', flexDirection: 'row' }}>
                    {productosCombo.map(pCombo => {
                        let pComboCantidadProd = 0;
                        combo.productos.forEach(prod => {
                            if (prod.idProducto === pCombo.id) {
                                pComboCantidadProd = prod.cantidad;
                            }
                        });
                        return <div style={{ margin: "20px", marginRight: '50px' }}>
                            <Card.Img variant="top" src={pCombo.fotos} style={{ width: '15rem', height: '15rem', margin: "auto" }} />
                            <div>
                                <Card.Title>{pCombo.nombre} - {pCombo.cantidad}</Card.Title>
                                <Card.Text>
                                    <span style={{ textDecoration: 'line-through', marginRight: '30px' }}>
                                        ${' ' + pCombo.precio}
                                    </span>
                                </Card.Text>
                                <Form.Group controlId="formBasicCAnt">
                                    <Form.Control type="number" name="cantidad"
                                        defaultValue={pComboCantidadProd}
                                        style={{ width: "90px", margin: "auto" }}
                                        disabled
                                    />
                                </Form.Group>
                            </div>
                        </div>
                    })}
                    {
                        editMode && <div style={{ display: 'flex', flexDirection: 'column', aligItems: 'center', paddingRight: '30px', justifyContent: 'center' }}>
                            <Card.Title>Precio Actual del Combo: {combo.precio}</Card.Title>
                            <Form.Group key='newPrecio' style={{ width: '225px', margin: '0px auto' }}>
                                <Form.Label>Cambiar precio del combo:</Form.Label>
                                <InputGroup>
                                    <InputGroup.Prepend><InputGroup.Text>$</InputGroup.Text></InputGroup.Prepend>
                                    <Form.Control
                                        type="number" id="nuevoPrecio"
                                        placeholder='Ingrese nuevo Precio'
                                        onChange={handleChange}
                                        defaultValue={combo.precio}
                                        isValid={nuevoPrecio > 0}
                                    />
                                </InputGroup>
                                {nuevoPrecio > 0 && <p>Descuento total: ${nuevoPrecio - combo.precio}</p>}
                            </Form.Group>
                            <br /><br />
                            {/* <Form.Group controlId="fechaInicio">
                                <Form.Label className="login-form-tittles" style={{ color: 'black' }}>Fecha de Inicio Combo</Form.Label>
                                <input
                                    type="date" id="date-inicio" name="date"
                                    value={fechaInicio === '' ? combo.fechaInicio : fechaInicio} min={todayDate}
                                    defaultValue={combo.fechaInicio}
                                    onChange={handleChange}
                                />
                                {/* {(fechaInicio === todayDate || fechaInicio === '') && <Form.Text className="text-muted-personalized">
                                    Seleccione la fecha de inicio.
                                </Form.Text>} 
                            </Form.Group> */}
                            <Form.Group controlId="formBasicCode">
                                <Form.Label >Fecha de Fin de Combo</Form.Label>
                                <InputGroup>
                                <input
                                    type="date" id="date-fin" name="date"
                                    value={fechaFin === '' ? combo.fechaFin : fechaFin} min={combo.fechaInicio}
                                    onChange={handleChange}
                                    style={{ margin: 'auto' }}
                                />
                                </InputGroup>

                                {/* {(fechaFin === '') && <Form.Text className="text-muted-personalized">
                                    Seleccione la fecha de fin del combo.
                                </Form.Text>} */}
                            </Form.Group>
                            <Button variant="primary" style={{ marginTop: '30px' }}
                                onClick={() => handleClick(combo)}
                            >
                                ACTUALIZAR INFO COMBO
                            </Button>
                        </div>
                    }
                </Card>
            </>
            : <div></div>
    )
}