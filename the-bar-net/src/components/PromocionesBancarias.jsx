import React, { useCallback, useEffect, useState } from 'react';
import './styles.css';
import { TheBarNetServerUrl } from './context/Url';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';

const formatFecha = (fechaFin) => {
    const [año, mes, dia] = fechaFin.split('-');
    console.log(año, mes, dia)
    let mesFormatted = '';
    switch (mes) {
        case '01':
            mesFormatted = 'enero';
            break;
        case '02':
            mesFormatted = 'febrero';
            break;
        case '03':
            mesFormatted = 'marzo';
            break;
        case '04':
            mesFormatted = 'abril';
            break;
        case '05':
            mesFormatted = 'mayo';
            break;
        case '06':
            mesFormatted = 'junio';
            break;
        case '07':
            mesFormatted = 'julio';
            break;
        case '08':
            mesFormatted = 'agosto';
            break;
        case '09':
            mesFormatted = 'septiembre';
            break;
        case '10':
            mesFormatted = 'octubre';
            break;
        case '11':
            mesFormatted = 'noviembre';
            break;
        case '12':
            mesFormatted = 'diciembre';
            break;

        default:
            break;
    }
    return `${dia} de ${mesFormatted}`;
}

export default function PromocionesBancarias({ update, adminMode = false }) {
    const todayDate = new Date().toJSON().slice(0, 10).replace(/-/g, '-');
    const [promos, setPromos] = useState([]);
    /** ejemplo
        descuento: "10%"
        fechaFin: "2021-07-31"
        fechaInicio: "2021-07-01"
        nombre: "Santander Río"
    */
    const [showAlert, setShowAlert] = useState(false);
    const [alertMsg, setAlertMsg] = useState('');

    useEffect(() => {
        fetch(TheBarNetServerUrl.promoBancos, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
            mode: 'cors', // no-cors
        })
            .then(res => res.json())
            .then(response => {
                console.log(response.rta);
                const vigentes = (response.rta.filter(element => {
                    let fin = (new Date(element.fechaFin))
                    let inicio = (new Date(element.fechaInicio))
                    let hoy = (new Date(todayDate))
                    return (inicio <= hoy) && (hoy <= fin);
                }));
                setPromos(vigentes);
            });
    }, [todayDate, update]);


    const handleDelete = useCallback(promo => {
        console.log(promo)
        fetch(TheBarNetServerUrl.promoBancos + `/${promo.id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            mode: 'cors'
        })
            .then(res => res.json())
            .catch(error => console.error('Error:', error))
            .then(response => {
                console.log(response);
                fetch(TheBarNetServerUrl.promoBancos, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    mode: 'cors', // no-cors
                })
                    .then(res => res.json())
                    .then(response => {
                        console.log(response.rta);
                        const vigentes = (response.rta.filter(element => {
                            let fin = (new Date(element.fechaFin))
                            let inicio = (new Date(element.fechaInicio))
                            let hoy = (new Date(todayDate))
                            return (inicio <= hoy) && (hoy <= fin);
                        }));
                        console.log('vigentes', vigentes);
                        setPromos(vigentes);
                    });
                setAlertMsg('Promoción borrada correctamente!');
                setShowAlert(true);
            });
    }, [todayDate]);

    return (
        <>
            {(promos.length > 0) &&
                <div>
                    <h1 className="tittle-style" style={{ marginBottom: "30px", fontSize: "40px", marginTop: "40px" }}>
                        PROMOCIONES BANCARIAS DISPONIBLES
                    </h1>
                    <div style={{ display: 'flex', justifyContent: 'space-around' }}>
                        {promos.map(promo => (
                            <Card style={{ width: '25%', height: 'fit-content', margin: "auto", backgroundColor: '#8a2be2' }}
                                key={promo.nombre + promo.descuento}>
                                {/* <Card.Img variant="top" src={p.fotos} style={{ width: '5rem', height: '5rem', margin: "auto" }} /> */}
                                <Card.Body>
                                    <Card.Title>PROMOCIÓN BANCO {promo.nombre.toUpperCase()}</Card.Title>
                                    <br />
                                    <p>{promo.descuento} de descuento en todas tus compras!</p>
                                    <p>Promoción válida hasta el {formatFecha(promo.fechaFin)}</p>
                                </Card.Body>
                                {adminMode && <Card.Footer>
                                    <Button onClick={() => handleDelete(promo)} variant='danger' size='sm'
                                        style={{ height: '30px' }}>
                                        BORRAR
                                    </Button>
                                </Card.Footer>}
                            </Card>
                        ))}
                    </div>
                </div>
            }
            <Modal show={showAlert} onHide={() => { setShowAlert(false); }}>
                <Modal.Header closeButton>
                    <Modal.Title>Aviso</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>{alertMsg}</p>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={() => { setShowAlert(false); }}>
                        Volver
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}