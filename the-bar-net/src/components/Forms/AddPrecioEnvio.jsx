import React, { useCallback, useEffect, useState } from 'react';
import '../styles.css';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import { TheBarNetServerUrl } from '../context/Url';
import InputGroup from 'react-bootstrap/InputGroup';

export default function AddPrecioEnvio() {
    const [precios, setPrecios] = useState([]);
    const [barrioNuevo, setBarrioNuevo] = useState('');
    const [precioNuevo, setPrecioNuevo] = useState(0);

    const [showAlert, setShowAlert] = useState(false);
    const [alertMsg, setAlertMsg] = useState('');

    const handleDelete = useCallback((precio) => {
        console.log('delete', precio);
        fetch(TheBarNetServerUrl.preciosEnvios + `/${precio.id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            mode: 'cors', // no-cors
        })
            .then(res => res.json())
            .then(response => {
                fetch(TheBarNetServerUrl.preciosEnvios, {
                    mode: 'cors'
                }).then(res => res.json())
                    .then(response => {
                        setPrecios(response.rta);
                    })
                setAlertMsg('Precio de envío borrado correctamente!');
                setShowAlert(true);
            })
            .catch(() => {
                setAlertMsg('Algo falló borrando el precio!');
                setShowAlert(true);
            });
    }, []);

    const handleAddNew = useCallback(() => {
        console.log(barrioNuevo, precioNuevo)
        fetch(TheBarNetServerUrl.preciosEnvios, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            mode: 'cors', // no-cors
            body: JSON.stringify({
                localidad: barrioNuevo,
                precio: precioNuevo
            })
        })
            .then(res => res.json())
            .then(response => {
                setBarrioNuevo('');
                setPrecioNuevo(0);
                fetch(TheBarNetServerUrl.preciosEnvios, {
                    mode: 'cors'
                }).then(res => res.json())
                    .then(response => {
                        setPrecios(response.rta);
                    })
                setAlertMsg('Precio para envíos agregado correctamente!');
                setShowAlert(true);
            })
            .catch(() => {
                setAlertMsg('Algo falló guardando el precio del envío!');
                setShowAlert(true);
            });
    }, [barrioNuevo, precioNuevo]);

    const handleChange = useCallback((value) => {
        switch (value.target.name) {
            case "barrio":
                setBarrioNuevo(value.target.value);
                break;
            case "precio":
                setPrecioNuevo(value.target.value);
                break;
            default:
                break;
        }
    }, []);

    const handleChangeSaved = useCallback((value, precioEnvio) => {
        switch (value.target.name) {
            // case "barrio":
            //     setBarrioNuevo(value.target.value);
            //     break;
            case "precio-edit":
                const newPrecio = Number.parseInt(value.target.value);
                if (newPrecio > 0) {
                    fetch(TheBarNetServerUrl.preciosEnvios + `/${precioEnvio.id}`, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        mode: 'cors', // no-cors,
                        body: JSON.stringify({
                            localidad: precioEnvio.localidad,
                            precio: newPrecio
                        })
                    })
                        .then(res => res.json())
                        .then(response => {
                            fetch(TheBarNetServerUrl.preciosEnvios, {
                                mode: 'cors'
                            }).then(res => res.json())
                                .then(response => {
                                    setPrecios(response.rta);
                                })
                            // setAlertMsg('Precio de envío modificado correctamente!');
                            // setShowAlert(true);
                        })
                        .catch(() => {
                            setAlertMsg('Algo falló borrando el precio!');
                            setShowAlert(true);
                        });
                }
                break;
            default:
                break;
        }
    }, [precios]);

    useEffect(() => {
        fetch(TheBarNetServerUrl.preciosEnvios, {
            mode: 'cors'
        }).then(res => res.json())
            .then(response => {
                console.log(response.rta);
                setPrecios(response.rta);
            })
    }, []);

    return (
        <>
            <div style={{ height: "100%", width: "80%", margin: "auto", fontSize: 'large' }}>
                <br />
                <h1 className="tittle-style" style={{ marginBottom: "30px", fontSize: "25px", marginTop: "40px" }}>
                    LOCALIDADES DISPONIBLES PARA ENVÍO DISPONIBLES Y PRECIOS
                </h1>
                <div style={{ display: 'flex', width: '80%', margin: 'auto', justifyContent: 'space-between' }}>
                    <div style={{ width: '60%' }}>

                        {precios.length > 0 && precios.map((value, index) =>
                            <Form key={value.id}>
                                <div style={{ display: 'flex', alignItems: 'baseline', marginBottom: '5px' }}>
                                    <Form.Group>
                                        {/* {index === 0 && <Form.Label>Localidad</Form.Label>} */}
                                        <Form.Control type="text" name="barrio"
                                            onChange={handleChange}
                                            defaultValue={value.localidad} disabled
                                        />
                                    </Form.Group>
                                    <Form.Group style={{ marginRight: '15px', marginLeft: '10px' }}>
                                        {/* {index === 0 && <Form.Label>Precio</Form.Label>} */}
                                        <InputGroup>
                                            <InputGroup.Prepend>
                                                <InputGroup.Text>$</InputGroup.Text>
                                            </InputGroup.Prepend>
                                            <Form.Control type="number" name="precio-edit"
                                                onChange={(v) => handleChangeSaved(v, value)}
                                                defaultValue={value.precio}
                                            />
                                        </InputGroup>
                                    </Form.Group><Button onClick={() => handleDelete(value)} variant='danger' size='sm'
                                        style={{ height: '30px' }}>
                                        X
                                    </Button>
                                </div>
                            </Form>
                        )}
                    </div>
                    <div style={{ width: '45%' }}>
                        <Form>
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                <Form.Group>
                                    <Form.Label>Localidad</Form.Label>
                                    <Form.Control type="text" name="barrio"
                                        onChange={handleChange}
                                        value={barrioNuevo}
                                    />
                                </Form.Group>
                                <Form.Group style={{ marginRight: '5px', marginLeft: '5px' }}>
                                    <Form.Label>Precio</Form.Label>
                                    <InputGroup>
                                        <InputGroup.Prepend>
                                            <InputGroup.Text>$</InputGroup.Text>
                                        </InputGroup.Prepend>
                                        <Form.Control type="number" name="precio"
                                            onChange={handleChange}
                                            value={precioNuevo}
                                        />
                                    </InputGroup>
                                </Form.Group>
                                <Button onClick={handleAddNew} variant='success' disabled={barrioNuevo === '' && precioNuevo < 0} size='sm'
                                    style={{ height: '45px', marginTop: '20px', marginLeft: '10px' }}>
                                    AGREGAR
                                </Button>
                            </div>
                        </Form>
                    </div>
                </div>
                <br /><br />
                <Modal show={showAlert} onHide={() => setShowAlert(false)}>
                    <Modal.Header closeButton>
                        <Modal.Title>Aviso</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <p>{alertMsg}</p>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="primary" onClick={() => setShowAlert(false)}>
                            Aceptar
                        </Button>
                    </Modal.Footer>
                </Modal>
            </div >
        </>
    )
}