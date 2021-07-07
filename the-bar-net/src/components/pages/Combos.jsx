import React, { useContext, useEffect, useState } from 'react';
import { TheNetBar } from '../context/TheNetBarContext';
import { TheBarNetServerUrl } from '../context/Url';
import Button from 'react-bootstrap/Button';
import Product from '../Product';
import ProductCombo from '../ProductCombo';
import '../styles.css';

export default function Combos() {
    const { addCarrito } = useContext(TheNetBar.Context);
    const [combos, setCombos] = useState([]);
    const [nombreCombo, setNombreCombo] = useState("");

    const addCarritoLocal = (combo) => {
        console.log('combo', combo);
        const comboPedido = {
            precio: combo.precio,
            idCombo: combo.id,
            nombre: nombreCombo,
            productos: combo.productos
        }
        addCarrito(comboPedido, 1);
    }
    /**
     * ejemplo combo
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
    useEffect(() => {
        fetch(TheBarNetServerUrl.combos, {
            mode: 'cors'
        }).then(res => res.json())
            .then(response => {
                let rta = response.rta;
                rta = rta.map(element => ({ ...element, productos: JSON.parse(element.productos) }));
                console.log(rta)
                setCombos(rta);
            })
    }, []);

    return (
        <div>
            <h1 className="tittle-style" style={{ marginTop: "20px" }}>COMBOS</h1>
            {combos.length > 0
                ? <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-around', alignItems: 'stretch' }}>
                    {combos.map(combo => (
                        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <ProductCombo
                                key={combo.id}
                                combo={combo}
                                setNombreCombo={setNombreCombo}
                            />
                            <h2 className="tittle-style" style={{ backgroundColor: 'white', margin: '10px', fontSize: '35px',
                                marginTop: '-20px', width: '60%', textShadow: '2px 1px #740e' }}>
                                Precio Total ${' ' + combo.precio}
                            </h2>
                            <Button variant="dark" onClick={() => addCarritoLocal(combo)}>AGREGAR AL CARRITO</Button>
                            <br /><br /><br />
                        </div>
                    ))}
                </div>
                : <div>
                    <h3>No hay combos disponibles actualmente :( </h3>
                </div>
            }
        </div >
    )
}