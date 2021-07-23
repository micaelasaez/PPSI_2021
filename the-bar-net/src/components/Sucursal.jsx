import React, { useEffect, useState } from 'react';
import { TheBarNetServerUrl } from './context/Url';
import './styles.css';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { useCallback } from 'react';
import Modal from 'react-bootstrap/Modal';

export default function Sucursal({ adminMode = false }) {
    const [sucursal, setSucursal] = useState(null);
    const [nombre, setNombre] = useState('');
    const [horarios, setHorarios] = useState('');
    const [direccion, setDireccion] = useState('');

    const [showAlert, setShowAlert] = useState(false);
    const [alertMsg, setAlertMsg] = useState('');

    /**susursal
        direccion: "Av. Córdoba 5653, Ciudad Autónoma de Buenos Aires"
        horarios: "Lunes a sábados de 11 a 21 hs"
        id: 1
        nombre: "Depósito Principal"
    */
    const updateSucursal = useCallback(() => {
        const suc = {
            nombre: nombre,
            direccion: direccion,
            horarios: horarios
        };
        console.log(suc)
        fetch(TheBarNetServerUrl.sucursal + `/${sucursal.id}`, {
            mode: 'cors',
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(suc)
        }).then(res => res.json())
            .then(response => {
                console.log(response);
                setAlertMsg('Los datos de la sucursal fueron modificados correctamente.');
                setShowAlert(true);
            })
            .catch(() => {
                setAlertMsg('Algo salió mal modificando los datos de la sucursal.');
                setShowAlert(true);
            })
    }, [direccion, horarios, nombre, sucursal]);

    useEffect(() => {
        fetch(TheBarNetServerUrl.sucursal, {
            mode: 'cors'
        }).then(res => res.json())
            .then(response => {
                const [sucursal] = response.rta;
                // console.log(sucursal);
                setSucursal(sucursal);
                setNombre(sucursal.nombre);
                setHorarios(sucursal.horarios);
                setDireccion(sucursal.direccion);
            })
    }, []);

    return (
        <div>
            {sucursal &&
                (adminMode
                    ? <Card style={{ width: '70%', height: 'fit-content', margin: "15%" }}>
                        <Card.Body>
                            <br />
                            <h3>DATOS DE SUCURSAL</h3>
                            <br />
                            <Form.Group>
                                <Form.Label>Tipo de sucursal</Form.Label>
                                <Form.Control type="text" name="nombre"
                                    onChange={(value) => setNombre(value.target.value)}
                                    isInvalid={nombre === ''}
                                    defaultValue={nombre}
                                // style={{ width: "90px", margin: "auto" }}
                                />
                            </Form.Group>
                            <br />
                            <Form.Group>
                                <Form.Label>Dirección</Form.Label>
                                <Form.Control type="text" name="direccion"
                                    onChange={(value) => setDireccion(value.target.value)}
                                    isInvalid={direccion === ''}
                                    defaultValue={direccion}
                                // style={{ width: "90px", margin: "auto" }}
                                />
                            </Form.Group>
                            <br />
                            <Form.Group>
                                <Form.Label>Horarios de atención</Form.Label>
                                <Form.Control type="text" name="horarios"
                                    onChange={(value) => setHorarios(value.target.value)}
                                    isInvalid={horarios === ''}
                                    defaultValue={horarios}
                                // style={{ width: "90px", margin: "auto" }}
                                />
                            </Form.Group>
                            <br /><br />
                            <Button variant="success" onClick={updateSucursal} disabled={horarios === '' || direccion === '' || nombre === ''}>
                                ACTUALIZAR DATOS
                            </Button>
                            <br />
                        </Card.Body>
                    </Card>
                    : <div style={{ width: '100%', textAlign: 'center', margin: '0 125px' }}>
                        <h5>DÓNDE ESTAMOS</h5>
                        <h5>{`${sucursal.direccion}  -  Horarios de atención: ${sucursal.horarios}`}</h5>
                        <br />
                    </div>
                )}
            {adminMode && <><br /><br /><br /><br /><br /></>}
            <Modal show={showAlert} onHide={() => setShowAlert(false)}>
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
        </div>
    )
}