import React, { useCallback, useEffect, useState } from 'react';
import '../styles.css';
import Modal from 'react-bootstrap/Modal';
import Table from 'react-bootstrap/Table';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import { TheBarNetServerUrl } from '../context/Url';
import ProductSmall from '../ProductSmall';
import InputGroup from 'react-bootstrap/InputGroup';

// const categories = [
//     { name: 'cervezas', title: 'Cervezas' },
//     { name: 'vinos', title: 'Vinos' },
//     { name: 'espumantes', title: 'Espumantes' },
//     { name: 'vodka', title: 'Vodkas' },
//     { name: 'whiskys', title: 'Whiskys' },
//     { name: 'sin-alcohol', title: 'Sin Alcohol' }
// ];
// const quantityTypes = [
//     { key: "ml", type: "ml" },
//     { key: "l", type: "l" },
//     { key: "six-pack", type: "Six Pack" },
//     { key: "12u", type: "Caja 12 unidades" },
//     { key: "24u", type: "Caja 24 unidades" }
// ];

export default function AddCombos() {
    const [productos, setProductos] = useState([]);
    const [productosCombo, setProductosCombo] = useState([]);
    // productos: Array(2)
    // p: p, cantidad: 2

    // 0: {idProducto: 1, cantidad: 3}
    // 1: {idProducto: 2, cantidad: 2}
    const [totalCombo, setTotalCombo] = useState('');
    const [nuevoPrecio, setNuevoPrecio] = useState(0);
    const todayDate = new Date().toJSON().slice(0, 10).replace(/-/g, '-');
    const [fechaInicio, setFechaInicio] = useState(todayDate);
    const [fechaFin, setFechaFin] = useState("");

    const [showAlert, setShowAlert] = useState(false);
    const [alertMsg, setAlertMsg] = useState('');

    const handleSaveCombo = useCallback(() => {
        const combo = {
            productos: JSON.stringify(productosCombo.map(pCombo => ({ idProducto: pCombo.p.id, cantidad: pCombo.cantidad }))),
            precio: nuevoPrecio,
            fechaInicio: fechaInicio,
            fechaFin: fechaFin
        };
        console.log(combo);
        fetch(TheBarNetServerUrl.combos, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            mode: 'cors', // no-cors
            body: JSON.stringify(combo)
        })
            .then(res => res.json())
            .then(response => {
                console.log(response);
                setAlertMsg('Combo creado correctamente!');
                setShowAlert(true);
            })
            .catch(() => {
                setAlertMsg('Algo falló con la creación del combo!');
                setShowAlert(true);
            });
    }, [fechaFin, fechaInicio, nuevoPrecio, productosCombo]);

    useEffect(() => {
        fetch(TheBarNetServerUrl.products, {
            mode: 'cors'
        }).then(res => res.json())
            .then(response => {
                setProductos(response.rta);
            })
    }, []);

    const cleanCombo = useCallback(() => {
        setProductosCombo([]);
        setTotalCombo(0);
        setNuevoPrecio(0);
        setFechaInicio(todayDate);
        setFechaFin('');
    }, [todayDate]);

    const addCombo = useCallback((p, cantidad) => {
        const pCombo = {
            p: p,
            cantidad: cantidad
        };
        const index = productosCombo.findIndex(pr => pr.p.id === pCombo.p.id);
        if (index === -1) {
            setProductosCombo([...productosCombo, pCombo]);
        } else {
            const arrProductosUpdated = [...productosCombo];
            const cant = arrProductosUpdated[index].cantidad + 1;
            arrProductosUpdated[index] = { ...arrProductosUpdated[index], cantidad: cant };
            setProductosCombo(arrProductosUpdated);
        }
    }, [productosCombo]);


    const handleDelete = useCallback((pCombo) => {
        const index = productosCombo.findIndex(p => p.p.id === pCombo.p.id);
        productosCombo.splice(index, 1);
        setProductosCombo([...productosCombo]);
    }, [productosCombo]);

    const updateCantidad = useCallback((cantidad, pCombo) => {
        const index = productosCombo.findIndex(p => p.p.id === pCombo.p.id);
        const arrProductosUpdated = [...productosCombo];
        arrProductosUpdated[index] = { ...arrProductosUpdated[index], cantidad: cantidad };
        setProductosCombo(arrProductosUpdated);
    }, [productosCombo]);

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

    useEffect(() => {
        let total = 0;
        productosCombo.forEach(p => {
            total += (p.cantidad * p.p.precio);
        });
        setTotalCombo(total);
    }, [productosCombo]);

    return (
        <>
            <div style={{ height: "100%", width: "100%", margin: "auto" }}>
                <br />
                <h1 className="tittle-style" style={{ marginBottom: "30px", fontSize: "35px", marginTop: "40px" }}>AGREGAR COMBO</h1>
                <p>
                    Los productos se encuentran ordenados por la fecha de vencimiento más cercana.
                </p>
                <div style={{ display: 'flex', justifyContent: "space-around" }}>
                    <div style={{ width: "55%" }}>
                        {productos.length > 0
                            ? <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-around', alignItems: 'stretch' }}>
                                {productos.map(p => (
                                    p.stockActual > 0 &&
                                    <ProductSmall
                                        key={p.id}
                                        p={p}
                                        addCombo={addCombo}
                                    />
                                ))}
                            </div>
                            : <div>
                                <h3>Disculpe, no hay productos actualmente!</h3>
                                <br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br />
                            </div>
                        }
                    </div>
                    <Card style={{ width: '45%', height: "fit-content" }}>
                        <Card.Body>
                            <Card.Title style={{ color: "black" }}>COMBO ACTUAL</Card.Title>
                            <Table responsive>
                                <thead className="table-row-title">
                                    <tr>
                                        <th colSpan="2">PRODUCTO</th><th>PRECIO</th><th>CANTIDAD</th><th>BORRAR</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {productosCombo.length > 0
                                        ? productosCombo.map(pCombo => {
                                            return <tr key={pCombo.p.id} className="table-row">
                                                <td>
                                                    <img src={pCombo.p.fotos} style={{ width: '5rem', height: '5rem', margin: "auto" }} alt="" />
                                                </td>
                                                <td>{pCombo.p.nombre}<br />{pCombo.p.cantidad}</td>
                                                <td>$ {pCombo.p.precio}</td>
                                                <td>
                                                    <Form.Group controlId="formBasicCant">
                                                        <Form.Control type="number" name="cantidad"
                                                            onChange={(value) => updateCantidad(value.target.value, pCombo)}
                                                            isInvalid={pCombo.cantidad < 1 || pCombo.cantidad > pCombo.p.stockActual}
                                                            // defaultValue={pCombo.cantidad}
                                                            value={pCombo.cantidad}
                                                            style={{ width: "90px", margin: "auto" }}
                                                        />
                                                        {pCombo.cantidad > pCombo.p.stockActual && <Form.Text className="text-muted-personalized">
                                                            Disculpe, no contamos con ese stock disponible!
                                                        </Form.Text>}
                                                        {pCombo.cantidad < 1 && <Form.Text className="text-muted-personalized">
                                                            Ingrese un número válido como cantidad!
                                                        </Form.Text>}
                                                    </Form.Group>
                                                </td>
                                                <td>
                                                    <Button variant="danger" size="sm" onClick={() => handleDelete(pCombo)}>
                                                        X
                                                    </Button>
                                                </td>
                                            </tr>
                                        })
                                        : <tr>
                                            <td colSpan='5'>
                                                <h6>Agregue productos al Combo</h6>
                                            </td>
                                        </tr>
                                    }
                                </tbody>
                            </Table>
                            <br />
                            <Card.Text>
                                Subtotal ${' ' + totalCombo}
                            </Card.Text>
                            <br />
                            <Form.Group key='newPrecio' style={{ width: '225px', margin: 'auto' }}>
                                <Form.Label>Ingrese precio para el combo:</Form.Label>
                                <InputGroup>
                                    <InputGroup.Prepend><InputGroup.Text>$</InputGroup.Text></InputGroup.Prepend>
                                    <Form.Control
                                        type="number" id="nuevoPrecio"
                                        placeholder='Ingrese nuevo Precio'
                                        value={nuevoPrecio}
                                        onChange={handleChange}
                                        isValid={nuevoPrecio > 0 && nuevoPrecio < totalCombo}
                                    />
                                </InputGroup>
                                <Form.Text id="passwordHelpBlock" muted>
                                    El precio del combo no puede ser mayor al precio total del combo.
                                </Form.Text>
                                {nuevoPrecio > 0 && <p>Descuento total: ${totalCombo - nuevoPrecio}</p>}
                            </Form.Group>
                            <br /><br />
                            <Form.Group controlId="fechaInicio">
                                <Form.Label className="login-form-tittles" style={{ color: 'black' }}>Fecha de Inicio Combo</Form.Label>
                                <input type="date" id="date-inicio" name="date" value={fechaInicio} min={todayDate} onChange={handleChange} />
                                {/* {(fechaInicio === todayDate || fechaInicio === '') && <Form.Text className="text-muted-personalized">
                                Seleccione la fecha de inicio.
                            </Form.Text>} */}
                            </Form.Group>
                            <Form.Group controlId="formBasicCode">
                                <Form.Label className="login-form-tittles" style={{ color: 'black' }}>Fecha de Fin de Combo</Form.Label>
                                <input type="date" id="date-fin" name="date" value={fechaFin} min={fechaInicio} onChange={handleChange} />
                                {(fechaFin === fechaInicio || fechaFin === '') && <Form.Text className="text-muted-personalized">
                                    Seleccione la fecha de fin del combo.
                                </Form.Text>}
                            </Form.Group>
                            <br />
                            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-around' }}>
                                <Button variant="danger" onClick={cleanCombo}>LIMPIAR</Button>
                                <Button
                                    className="personalized-button"
                                    onClick={handleSaveCombo}
                                    disabled={productosCombo.length < 1
                                        || nuevoPrecio < 0
                                        || fechaFin === fechaInicio
                                        || fechaFin === ''
                                        || nuevoPrecio > totalCombo
                                        || (productosCombo.length === 1 && productosCombo[0].cantidad < 2)
                                    }
                                >
                                    GUARDAR COMBO
                                </Button>
                            </div>
                        </Card.Body>
                    </Card>
                </div>
                <br /><br /><br />
            </div>
            <Modal show={showAlert} onHide={() => setShowAlert(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Aviso</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>{alertMsg}</p>
                </Modal.Body>
                <Modal.Footer>
                {/* window.location.reload(); */}
                    <Button variant="primary" onClick={() => { setShowAlert(false); cleanCombo();}}>
                        Volver
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}