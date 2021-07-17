import React, { useCallback, useContext, useEffect, useState } from 'react';
import { TheNetBar } from '../context/TheNetBarContext';
import { TheBarNetServerUrl } from '../context/Url';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import ProductCombo from '../ProductCombo';
import '../styles.css';
import { useLocation } from 'react-router-dom';
const modalStyle = {
    'modal-backdrop.show': {
        opacity: '0.85'
    }
}
export default function Combos() {
    const { addCarrito } = useContext(TheNetBar.Context);
    const [combos, setCombos] = useState([]);
    const [nombreCombo, setNombreCombo] = useState("");
    const [adminMode, setAdminMode] = useState(false);
    const { state } = useLocation();
    const [showAlert, setShowAlert] = useState(false);
    const [alertMsg, setAlertMsg] = useState('');

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

    const handleUpdateCombo = useCallback((combo, nuevoPrecio, fechaFin) => {
        console.log('update', combo);
        const datosComboUpdated = {
            productos: JSON.stringify(combo.productos),
            precio: nuevoPrecio > 0 ? Number.parseInt(nuevoPrecio) : Number.parseInt(combo.precio),
            fechaInicio: combo.fechaInicio,
            fechaFin: fechaFin === '' ? combo.fechaFin : fechaFin
        };
        console.log('updated', datosComboUpdated)
        fetch(TheBarNetServerUrl.combos + combo.id, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            mode: 'cors',
            body: JSON.stringify(datosComboUpdated)
        }).then(res => res.json())
            .then(response => {
                console.log(response);
                setAlertMsg('Combo modificado correctamente!');
                setShowAlert(true);

                // fetch(TheBarNetServerUrl.combos, {
                //     mode: 'cors'
                // }).then(res => res.json())
                //     .then(response => {
                //         let rta = response.rta;
                //         rta = rta.map(element => ({ ...element, productos: JSON.parse(element.productos) }));
                //         console.log(rta)
                //         setCombos(rta);
                //     });
            })
            .catch(() => {
                setAlertMsg('Algo falló borrando el Combo!');
                setShowAlert(true);
            });
    }, []);


    const handleDeleteCombo = combo => {
        console.log('delete', combo)
        fetch(TheBarNetServerUrl.combos + combo.id, {
            mode: 'cors',
            method: 'DELETE'
        }).then(res => res.json())
            .then(response => {
                console.log(response);
                setAlertMsg('Combo borrado correctamente!');
                setShowAlert(true);

                fetch(TheBarNetServerUrl.combos, {
                    mode: 'cors'
                }).then(res => res.json())
                    .then(response => {
                        let rta = response.rta;
                        rta = rta.map(element => ({ ...element, productos: JSON.parse(element.productos) }));
                        console.log(rta)
                        setCombos(rta);
                    })
            })
            .catch(() => {
                setAlertMsg('Algo falló borrando el combo!');
                setShowAlert(true);
            });
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
        if (state && state.adminMode) {
            setAdminMode(true);
        }
        fetch(TheBarNetServerUrl.combos, {
            mode: 'cors'
        }).then(res => res.json())
            .then(response => {
                let rta = response.rta;
                rta = rta.map(element => ({ ...element, productos: JSON.parse(element.productos) }));
                console.log(rta)
                setCombos(rta);
            })
    }, [state]);

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
                                editMode
                                handleUpdateCombo={handleUpdateCombo}
                            />
                            {
                                adminMode
                                    ? <div>
                                        <Button variant="danger" onClick={() => handleDeleteCombo(combo)}>BORRAR COMBO</Button>
                                    </div>
                                    : <div>
                                        <h2 style={{
                                            backgroundColor: 'white', margin: '10px', fontSize: '40px',
                                            marginTop: '-20px', width: '100%', fontWeight: 620,
                                            //textShadow: '1px 1px #740ecd'
                                            color: '#740ecd'
                                        }}>
                                            Precio Total ${' ' + combo.precio}
                                        </h2>
                                        <Button variant="info" onClick={() => addCarritoLocal(combo)}>AGREGAR AL CARRITO</Button>
                                    </div>
                            }
                            <br /><br /><br />
                        </div>
                    ))}
                </div>
                : <div>
                    <h3>No hay combos disponibles actualmente :( </h3>
                </div>
            }
            <Modal show={showAlert} onHide={() => setShowAlert(false)} className={modalStyle}>
                <Modal.Header closeButton>
                    <Modal.Title>Aviso</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>{alertMsg}</p>
                </Modal.Body>
                <Modal.Footer>
                    {/* window.location.reload(); */}
                    <Button variant="primary" onClick={() => { setShowAlert(false); window.location.reload(); }}>
                        Volver
                    </Button>
                </Modal.Footer>
            </Modal>
        </div >
    )
}