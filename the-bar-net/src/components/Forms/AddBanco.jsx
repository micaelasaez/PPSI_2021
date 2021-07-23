import React, { useCallback, useEffect, useState } from 'react';
import '../styles.css';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import { TheBarNetServerUrl } from '../context/Url';

export default function AddBanco({ updateRender }) {
    const [bancos, setBancos] = useState([]); // ejemplo {id: 8, nombre: "Banco Ciudad"}
    const [bancoNuevo, setBancoNuevo] = useState('');

    const [showAlert, setShowAlert] = useState(false);
    const [alertMsg, setAlertMsg] = useState('');

    const handleDelete = useCallback((banco) => {
        console.log(banco);
        fetch(TheBarNetServerUrl.bancos + `/${banco.id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            mode: 'cors', // no-cors
        })
            .then(res => res.json())
            .then(response => {
                fetch(TheBarNetServerUrl.bancos, {
                    mode: 'cors'
                }).then(res => res.json())
                .then(response => {
                    setBancos(response.rta);
                })
                setAlertMsg('Banco borrado correctamente!');
                setShowAlert(true);
            })
            .catch(() => {
                setAlertMsg('Algo falló borrando el banco!');
                setShowAlert(true);
            })
            .finally(() => updateRender());
    }, [updateRender]);

    const handleAddNew = useCallback(() => {
        console.log(bancoNuevo)
        fetch(TheBarNetServerUrl.bancos, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            mode: 'cors', // no-cors
            body: JSON.stringify({
                nombre: bancoNuevo
            })
        })
            .then(res => res.json())
            .then(response => {
                setBancoNuevo('');
                fetch(TheBarNetServerUrl.bancos, {
                    mode: 'cors'
                }).then(res => res.json())
                .then(response => {
                    setBancos(response.rta);
                })
                setAlertMsg('Banco agregado correctamente!');
                setShowAlert(true);
            })
            .catch(() => {
                setAlertMsg('Algo falló guardando el banco!');
                setShowAlert(true);
            })
            .finally(() => updateRender());
    }, [bancoNuevo, updateRender]);

    const handleChange = useCallback((value, banco) => {
        if (banco !== null) {
            // const index = bancos.findIndex(b => b.id === banco.id);
            // const newBancos = [...bancos];
            // newBancos[index].name = value;
            // setBancos(newBancos);
        } else {
            setBancoNuevo(value);
        }
    }, []);

    useEffect(() => {
        fetch(TheBarNetServerUrl.bancos, {
            mode: 'cors'
        }).then(res => res.json())
            .then(response => {
                setBancos(response.rta);
            })
    }, []);

    return (
        <>
            <div style={{ height: "100%", width: "60%", margin: "auto", fontSize: 'large' }}>
                <br />
                <h1 className="tittle-style" style={{ marginBottom: "30px", fontSize: "35px", marginTop: "40px" }}>
                    AGREGAR BANCO
                </h1>
                {bancos.length > 0 && bancos.map(banco =>
                    <Form key={banco.id}>
                        <div style={{ display: 'flex' }}>
                            <Form.Group>
                                <Form.Control type="text" name="name"
                                    onChange={(value) => handleChange(value.target.value, banco)}
                                    defaultValue={banco.nombre} disabled
                                />
                            </Form.Group>
                            <Button onClick={() => handleDelete(banco)} variant='danger' size='sm'
                                style={{ height: '30px', marginLeft: '5px', marginTop: '4px' }}>
                                X
                            </Button>
                        </div>
                    </Form>
                )}
                <br />
                <Form>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <Form.Group style={{ width: '70%', marginRight: '10px' }}>
                            <Form.Label style={{ width: '70%' }}>Banco nuevo</Form.Label>
                            <Form.Control type="text" name="name-nuevo"
                                onChange={(value) => handleChange(value.target.value, null)}
                                value={bancoNuevo}
                            />
                        </Form.Group>
                        <Button onClick={handleAddNew} variant='success' disabled={bancoNuevo === ''} size='sm'
                            style={{ height: '45px', marginTop: '20px' }}>
                            AGREGAR
                        </Button>
                    </div>
                </Form>
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