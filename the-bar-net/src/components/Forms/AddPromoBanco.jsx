import React, { useCallback, useEffect, useState } from 'react';
import '../styles.css';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import { TheBarNetServerUrl } from '../context/Url';

const descuentos = ['5%', '10%', '15%', '20%', '25%', '30%', '35%'];

export default function AddPromoBanco({ updateRender, update }) {
    const todayDate = new Date().toJSON().slice(0, 10).replace(/-/g, '-');
    const [bancos, setBancos] = useState([]); // ejemplo {id: 8, nombre: "Banco Ciudad"}
    const [promoBancos, setPromoBancos] = useState([]);
    /* ejemplo
        descuento: "10%"
        fechaFin: "2021-07-31"
        fechaInicio: "2021-07-01"
        nombre: "Santander Río"
    */
    const [bancoSeleccionado, setBancoSeleccionado] = useState(0);
    const [tipoTarjeta, setTipoTarjeta] = useState('credito');
    const [descuento, setDescuento] = useState(descuentos[0]);
    const [fechaInicio, setFechaInicio] = useState(todayDate);
    const [fechaFin, setFechaFin] = useState("");

    const [showAlert, setShowAlert] = useState(false);
    const [alertMsg, setAlertMsg] = useState('');

    const handleSubmit = useCallback(() => {
        const promo = {
            idBanco: bancoSeleccionado,
            tipoTarjeta: tipoTarjeta,
            descuento: descuento,
            fechaInicio: fechaInicio,
            fechaFin: fechaFin
        };
        console.log(promo);
        fetch(TheBarNetServerUrl.promoBancos, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            mode: 'cors', // no-cors
            body: JSON.stringify(promo)
        })
            .then(res => res.json())
            .then(response => {
                console.log('response 1', response);
                setAlertMsg('Promoción bancaria creada correctamente!');
                setShowAlert(true);
                setFechaFin('');
                // setTipoTarjeta('credito');
                setDescuento(descuentos[0]);
            })
            .catch(() => {
                setAlertMsg('Algo falló con la creación de la promoción bancaria!');
                setShowAlert(true);
            })
            .finally(() => updateRender());
    }, [bancoSeleccionado, tipoTarjeta, descuento, fechaFin, fechaInicio, updateRender]);

    const handleChange = useCallback((value) => {
        // if (value.target.id === "photo") {
        //     setPhoto(value.target.files[0])
        //     return setPhotoLocalURL(URL.createObjectURL(value.target.files[0]))
        // }
        switch (value.target.id) {
            case "banco":
                const idBanco = (bancos.find(b => b.nombre === value.target.value)).id;
                setBancoSeleccionado(idBanco);
                break;
            case "tipo":
                setTipoTarjeta(value.target.value);
                break;
            case "date-inicio":
                setFechaInicio(value.target.value);
                break;
            case "date-fin":
                setFechaFin(value.target.value);
                break;
            case "descuento":
                setDescuento(value.target.value);
                break;
            default:
                break;
        }
    }, [bancos]);

    useEffect(() => {
        fetch(TheBarNetServerUrl.bancos, {
            mode: 'cors'
        }).then(res => res.json())
            .then(response => {
                setBancos(response.rta);
                setBancoSeleccionado(response.rta[0].id);
                fetch(TheBarNetServerUrl.promoBancos, {
                    mode: 'cors'
                }).then(res => res.json())
                    .then(response => {
                        setPromoBancos(response.rta);
                    })
            })
    }, [update]);

    return (
        <>
            <div style={{ height: "100%", width: "60%", margin: "auto", fontSize: 'large' }}>
                <br />
                <h1 className="tittle-style" style={{ marginBottom: "30px", fontSize: "35px", marginTop: "40px" }}>AGREGAR PROMOCIÓN BANCARIA</h1>
                {bancos.length > 0 &&
                    <Form>
                        {/* // <Form.Group>
                        //     <div style={{ display: 'flex', margin: 'auto', justifyContent: "space-around" }}>
                        //         <input type="file" id="photo" onChange={handleChange} accept="image/*" name="photo" />
                        //         {photoLocalURL !== null && <div>
                        //             <img src={photoLocalURL} alt="" style={{ height: "120px", width: "120px", marginTop: "5px" }} />
                        //         </div>}
                        //     </div>
                        // </Form.Group> */}
                        <Form.Group>
                            <div style={{ display: 'flex' }}>
                                <Form.Label style={{ width: '70%' }}>Seleccione banco para la promoción</Form.Label>
                                <Form.Control as="select" onChange={handleChange} id='banco' style={{ width: '195px' }}>
                                    {bancos.map(banco => (
                                        <option key={banco.id}>{banco.nombre}</option>
                                    ))}
                                </Form.Control>
                            </div>
                        </Form.Group>
                        <Form.Group>
                            <div style={{ display: 'flex' }}>
                                <Form.Label style={{ width: '70%' }}>Seleccione tipo de tarjeta</Form.Label>
                                <Form.Control as="select" onChange={handleChange} id='tipo' style={{ width: '195px' }}>
                                    <option key={'credito'} value={'credito'} selected>Crédito</option>
                                    <option key={'debito'} value={'debito'}>Débito</option>
                                </Form.Control>
                            </div>
                        </Form.Group>
                        <Form.Group>
                            <div style={{ display: 'flex' }}>
                                <Form.Label style={{ width: '70%' }}>Seleccione fecha de inicio</Form.Label>
                                <input type="date" id="date-inicio" name="date-inicio" value={fechaInicio}
                                    min={todayDate} onChange={handleChange} />
                            </div>
                        </Form.Group>
                        <Form.Group>
                            <div style={{ display: 'flex' }}>
                                <Form.Label style={{ width: '70%' }}>Seleccione fecha de fin</Form.Label>
                                <input type="date" id="date-fin" name="date-fin" value={fechaFin}
                                    min={fechaInicio} onChange={handleChange} />
                            </div>
                        </Form.Group>
                        <Form.Group>
                            <div style={{ display: 'flex' }}>
                                <Form.Label style={{ width: '70%' }}>Seleccione porcentaje de descuento</Form.Label>
                                <Form.Control as="select" onChange={handleChange} id='descuento' style={{ width: '195px' }}>
                                    {descuentos.map(descuento => (
                                        <option key={descuento}>{descuento}</option>
                                    ))}
                                </Form.Control>
                            </div>
                        </Form.Group>
                        <Button onClick={handleSubmit} disabled={fechaFin === ''} className="personalized-button">
                            Guardar
                        </Button>
                    </Form>
                }
                <br /><br /><br />
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
            </div>
        </>
    )
}