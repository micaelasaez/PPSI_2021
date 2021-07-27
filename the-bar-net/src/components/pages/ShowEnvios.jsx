import React, { useCallback, useEffect, useState } from 'react';
import '../styles.css';
import Card from 'react-bootstrap/Card';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { TheBarNetServerUrl } from '../context/Url';
import { modalidadPago } from '../pages/FinalizarCompra';

const styles = {
    product: {
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
        alignItems: 'stretch',
        marginTop: '25px'
    },
    title: {
        marginTop: '25px',
        fontSize: '30px'
    }
}
/*  ENVIO
    codigoPostal: 1111
    direccion: "Lavalle 844, CABA"
    entregado: "no"
    fecha: "25-7-2021 0:16:17"
    id: 6
    idPedido: 16
    idPrecioEnvio: 1
    idUsuario: 26
    precio: 1500
    PEDIDO
        estado: "a_enviar"
        fecha: "2021-7-5 0:22:58"
        idUsuario: 26
        modalidadPago: "efectivo"
        tipoEnvio: "envio"
        total: 1500
    USUARIO
        apellido: "Uno"
        codigoPostal: 1111
        cuit: "22123456779"
        direccion: "Lavalle 844"
        dni: 12345678
        email: "cliente@gmail.com"
        localidad: "1"
        nombre: "Cliente"
        password: "12345"
        provincia: "Buenos Aires"
        telefono: "0111511112222"
        tipo: "cliente"
*/
export default function ShowEnvios() {
    const [envios, setEnvios] = useState([]);
    const [prodsToShow, setProdsToShow] = useState([]);

    const [showAlert, setShowAlert] = useState(false);
    const [alertMsg, setAlertMsg] = useState('');

    const showProductos = useCallback((idPedido) => {
        let prodsToShow = [];
        fetch(TheBarNetServerUrl.productoPedido + `/${idPedido}`, {
            mode: 'cors'
        })
            .then(res => res.json())
            .then(response => {
                if (response.rta.length > 0) {
                    const productos = response.rta.map(r => r[0]);
                    productos.forEach(prod => {
                        const index = prodsToShow.findIndex(pts => pts.prod.fotos === prod.fotos);
                        if (index !== -1) {
                            prodsToShow[index].cantidad++;
                        } else {
                            prodsToShow.push({
                                prod: prod,
                                cantidad: 1
                            });
                        }
                    });
                    setProdsToShow(prodsToShow);
                    setShowAlert(true)
                }
            })
            .catch(err => {
                console.log(err)
                // setAlertMsg('Algo falló recuperando la información de los productos');
                // setShowAlert(true);
            });
    }, []);

    useEffect(() => {
        fetch(TheBarNetServerUrl.envios, {
            mode: 'cors'
        }).then(res => res.json())
            .then(response => {
                const envios = response.rta;
                // console.log(envios);
                envios.forEach(envio => {
                    if (envio.entregado === 'no') {
                        fetch(TheBarNetServerUrl.pedido + `/${envio.idPedido}`, {
                            mode: 'cors'
                        }).then(res => res.json())
                            .then(response => {
                                const pedido = response.rta;
                                // console.log(pedido);
                                fetch(TheBarNetServerUrl.users + `/${envio.idUsuario}`, {
                                    mode: 'cors'
                                }).then(res => res.json())
                                    .then(response => {
                                        const usuario = response.rta;
                                        // console.log(usuario);

                                        setEnvios(e => [...e, {
                                            ...envio,
                                            pedido: pedido[0],
                                            usuario: usuario[0]
                                        }]);
                                        // showProductos(envio.id);
                                    })
                            })
                    }
                });
            })
            .catch((err) => {
                console.log(err)
                setAlertMsg('Algo falló recuperando la información de los envíos');
                setShowAlert(true);
            });
    }, [showProductos]);

    // useEffect(() => {
    //     console.log('envios', envios)

    //     // envios.forEach(envio => { });
    // }, [envios]);

    const handleUpdateEnvioEntregado = useCallback((idEnvio) => {
        const envioEntregado = envios.find(p => p.id === idEnvio);
        console.log('entregado', idEnvio);

        fetch(TheBarNetServerUrl.enviosEntrega + `/${idEnvio}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            mode: 'cors'
        }).then(res => res.json())
            .then(response => {
                console.log(response);
                fetch(TheBarNetServerUrl.pedido + `/${envioEntregado.idPedido}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    mode: 'cors', // no-cors
                    body: JSON.stringify({
                        estado: 'entregado'
                    })
                }).then(res => res.json())
                    .then(response => {
                        console.log('response pedido', response);
                        const enviosSinEntregar = envios.filter(p => p.id !== envioEntregado.id);
                        console.log(enviosSinEntregar)
                        setEnvios(enviosSinEntregar);

                        setAlertMsg('El envío fue registrado correctamente.');
                        setShowAlert(true);
                    });
            })
            .catch((e) => {
                console.log(e)
                setAlertMsg('Algo falló guardando el envío!');
                setShowAlert(true);
            });
    }, [envios]);


    return (
        <div>
            <h1 className="tittle-style" style={styles.title}>PEDIDOS SIENDO ENVIADOS</h1>
            <div style={styles.product}>
                {envios.length > 0
                    ? envios.map(envio =>
                        <Card style={{ width: '700px', height: 'fit-content', margin: "20px" }} key={envio.fecha}>
                            <Card.Body>
                                <Card.Title style={{ display: 'flex', justifyContent: 'space-around' }}>
                                    <span>Info del pedido:</span>
                                    <span>${envio.precio}</span>
                                </Card.Title>
                                <div style={{ width: '70%', margin: 'auto', fontSize: '1.1rem', lineHeight: 2.5 }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <span>Cliente:</span>
                                        <span>{`${envio.usuario.nombre} ${envio.usuario.apellido}`}</span>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <span>Direccion:</span>
                                        <span>{envio.direccion}</span>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <span>CP:</span>
                                        <span>{envio.codigoPostal}</span>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <span>Fecha pedido:</span>
                                        <span>{envio.pedido.fecha}</span>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <span>Modalidad de Pago:</span>
                                        <span>{(modalidadPago.find(m => m.id === envio.pedido.modalidadPago))?.name}</span>
                                    </div>
                                </div>
                                <br />
                                <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-around' }}>
                                    <Button variant='dark' onClick={() => showProductos(envio.idPedido)} size='sm'>
                                        VER PRODUCTOS DEL PEDIDO
                                    </Button>
                                </div>
                                <br />
                                {
                                    envio.pedido.modalidadPago === 'efectivo'
                                        ? <h2>Cobrar al cliente ${envio.precio}</h2>
                                        : <h6>El pago del pedido ya fue efectuado correctamente!</h6>
                                }
                                <br />
                                <Button variant="success" onClick={() => handleUpdateEnvioEntregado(envio.id)} >
                                    {envio.pedido.modalidadPago === 'efectivo'
                                        ? 'MARCAR COMO ENTREGADO Y COBRADO'
                                        : 'MARCAR COMO ENTREGADO'
                                    }
                                </Button>
                            </Card.Body>
                        </Card>
                    )
                    : <p>
                        <h3>No hay envíos pendientes actualmente!</h3>
                        <br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br />
                    </p>
                }
            </div>
            <Modal show={showAlert} onHide={() => { setShowAlert(false); setProdsToShow([]) }}>
                <Modal.Header closeButton>
                    <Modal.Title>Aviso</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>{alertMsg}</p>
                    {prodsToShow.length > 0 &&
                        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-around' }}>
                            {prodsToShow.map(p => (
                                <Card style={{ width: '20rem', height: 'fit-content', marginTop: '10px' }} key={p.fecha}>
                                    <Card.Img variant="top" src={p.prod.fotos}
                                        style={{ width: '5rem', height: '5rem', margin: "auto" }} />
                                    <Card.Body>
                                        <Card.Title>{p.prod.nombre} - {p.prod.cantidad}</Card.Title>
                                        <Card.Title>Cant. unidades: {p.cantidad}</Card.Title>
                                        <Card.Title>Precio unitario: ${p.prod.precio}</Card.Title>
                                    </Card.Body>
                                </Card>
                            ))}
                        </div>}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={() => { setShowAlert(false); setProdsToShow([]) }}>
                        Volver
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    )
}