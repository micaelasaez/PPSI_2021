import React, { useCallback, useEffect, useState } from 'react';
import './styles.css';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import { TheBarNetServerUrl } from './context/Url';
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
export default function ProductCombo({ combo, setNombreCombo }) {
    const [productosCombo, setProductosCombo] = useState([]);
    const todayDate = new Date().toJSON().slice(0, 10).replace(/-/g, '-');
    const [cantidad, setCantidad] = useState(1);
    const [fechaInicio, setFechaInicio] = useState(todayDate);
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

    // const nuevoPrecioValid = nuevoPrecio > 0;
    // const fechaInicioValid = true;
    // // const fechaInicioValid = fechaInicio !== null;
    // // const fechaFinValid = fechaFin !== null;
    // const fechaFinValid = true;

    // const handleChange = useCallback((value) => {
    //     switch (value.target.id) {
    //         case "nuevoPrecio":
    //             setNuevoPrecio(value.target.value);
    //             break;
    //         case "date-inicio":
    //             setFechaInicio(value.target.value);
    //             break;
    //         case "date-fin":
    //             setFechaFin(value.target.value);
    //             break;
    //         default:
    //             break;
    //     }
    // }, []);

    useEffect(() => {
        if (combo.productos.length > 0) {
            combo.productos.forEach(prod => {
                fetch(TheBarNetServerUrl.products + `/${prod.idProducto}`, {
                    mode: 'cors'
                })
                    .then(res => res.json())
                    .then(response => {
                        let [producto] = response.rta;
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
                </Card>
            </>
            : <div></div>
    )
}