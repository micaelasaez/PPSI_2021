import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router';
import '../styles.css';
import Product from '../Product';
import { TheBarNetServerUrl } from '../context/Url';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import AddPromoBanco from '../Forms/AddPromoBanco';
import AddBanco from '../Forms/AddBanco';
import PromocionesBancarias from '../PromocionesBancarias';

const styles = {
    product: {
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
        alignItems: 'stretch'
    },
    title: {
        marginTop: '25px'
    }
}

export default function BancosYPromos() {
    const [reRender, setReRender] = useState(false);
    const [showAlert, setShowAlert] = useState(false);
    const [alertMsg, setAlertMsg] = useState('');

    return (
        <div>
            {console.log(reRender)}
            <div style={{ width: '80%', margin: 'auto', display: 'flex', justifyContent: 'space-between' }}>
                <div style={{ width: '40%' }}>
                    <AddBanco updateRender={() => setReRender(r => !r)} />
                </div>
                <div style={{ width: '80%' }}>
                    <AddPromoBanco update={reRender} updateRender={() => setReRender(r => !r)}  />
                </div>
            </div>
            <div>
                <PromocionesBancarias update={reRender} adminMode />
                <br /><br />
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
                    <Button variant="primary" onClick={() => { setShowAlert(false); window.location.reload(); }}>
                        Volver
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    )
}