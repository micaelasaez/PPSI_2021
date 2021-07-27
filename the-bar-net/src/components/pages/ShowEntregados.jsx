import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import '../styles.css';
import Card from 'react-bootstrap/Card';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { TheBarNetServerUrl } from '../context/Url';
import { modalidadPago } from '../pages/FinalizarCompra';
import { TheNetBar } from '../context/TheNetBarContext';

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
export default function ShowEntregados() {
    let fechaActual = new Date();
    const date = fechaActual.getDate() + '-' + (fechaActual.getMonth() + 1) + '-' + fechaActual.getFullYear();
    const time = fechaActual.getHours() + ":" + fechaActual.getMinutes() + ":" + fechaActual.getSeconds();
    const todayDate = date + ' ' + time;

    const { token } = useContext(TheNetBar.Context);
    const [user, setUser] = useState({});

    const [envios, setEnvios] = useState([]);
    const [enviosToday, setEnviosToday] = useState([]);

    const [showEnviosToday, setShowEnviosToday] = useState(true);

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
                    setShowAlert(true);
                }
            })
            .catch(err => {
                console.log(err)
                // setAlertMsg('Algo falló recuperando la información de los productos');
                // setShowAlert(true);
            });
    }, []);

    useEffect(() => {
        if (token !== "") {
            fetch(TheBarNetServerUrl.verifyToken, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                mode: 'cors', // no-cors
                body: JSON.stringify({
                    token: token
                })
            }).then(res => res.json())
                .then(response => {
                    const userProfile = response.rta;
                    console.log(userProfile);
                    setUser(userProfile);
                });
        }
    }, [token]);

    useEffect(() => {
        fetch(TheBarNetServerUrl.envios, {
            mode: 'cors'
        }).then(res => res.json())
            .then(response => {
                const envios = [...response.rta];
                envios.sort((a, b) => a.id < b.id ? 1 : -1);
                envios.forEach(envio => {
                    if (envio.entregado !== 'no') {
                        fetch(TheBarNetServerUrl.pedido + `/${envio.idPedido}`, {
                            mode: 'cors'
                        }).then(res => res.json())
                            .then(response => {
                                const pedido = response.rta;
                                let prodsToShow = [];
                                fetch(TheBarNetServerUrl.productoPedido + `/${envio.idPedido}`, {
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
                                        }
                                        fetch(TheBarNetServerUrl.users + `/${envio.idUsuario}`, {
                                            mode: 'cors'
                                        }).then(res => res.json())
                                            .then(response => {
                                                const usuario = response.rta;
                                                const pedidoDate = (envio.entregado).split(' ');
                                                if (pedidoDate[0] === date) {
                                                    setEnviosToday(e => [...e, {
                                                        ...envio,
                                                        pedido: pedido[0],
                                                        usuario: usuario[0],
                                                        productos: prodsToShow
                                                    }]);
                                                } else {
                                                    setEnvios(e => [...e, {
                                                        ...envio,
                                                        pedido: pedido[0],
                                                        usuario: usuario[0],
                                                        productos: prodsToShow
                                                    }]);
                                                }
                                            })
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
    }, [date, todayDate]);

    const showEnvioData = useCallback((arr) => {
        return arr.map(envio => {
            return <Card style={{ width: '700px', height: 'fit-content', margin: "20px" }} key={envio.fecha}>
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
                        {/* <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span>Fecha pedido:</span>
                            <span>{envio.pedido.fecha}</span>
                        </div> */}
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span>Modalidad de Pago:</span>
                            <span>{(modalidadPago.find(m => m.id === envio.pedido.modalidadPago))?.name}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span>Fecha entregado:</span>
                            <span>{envio.entregado}</span>
                        </div>
                        {user !== null &&
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span>Entregado por:</span>
                                <div style={{ display: 'flex', flexDirection: 'column' }}>
                                    <span>{`${user.nombre} ${user.apellido}`}</span>
                                    <span>{`DNI: ${user.dni}`}</span>
                                    <span>{`CUIT: ${user.cuit}`}</span>
                                </div>
                            </div>
                        }
                        <br />
                    </div>
                    {/*  <br />
                    <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-around' }}>
                        <Button variant='dark' onClick={() => showProductos(envio.idPedido)} size='sm'>
                            VER PRODUCTOS DEL PEDIDO
                        </Button>
                    </div> 
                    <br />*/}
                    {envio.productos.length > 0 &&
                        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-around' }}>
                            {envio.productos.map(p => (
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
                        </div>
                    }
                    {envio.pedido.modalidadPago === 'efectivo'
                        && <h4 style={{ marginTop: '25px' }}>Se cobró al cliente ${envio.precio}</h4>
                    }
                    <br />
                </Card.Body>
            </Card>
        });
    }, [user]);

    return (
        <div>
            <h1 className="tittle-style" style={styles.title}>CONSTANCIAS DE ENTREGAS DEL DÍA</h1>
            {/* <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-around' }}>
                <Button variant='warning' onClick={() => setShowEnviosToday(s => !s)}>
                    {showEnviosToday
                        ? 'VER TODAS LAS CONSTANCIAS DE ENTREGA'
                        : 'VER SÓLO ENTREGAS DEL DÍA'
                    }
                </Button>
            </div> */}
            {showEnviosToday
                ? (<div>
                    {/* <div className="tittle-style" style={{ fontSize: '35px', marginTop: '45px', marginBottom: '-30px' }}>
                        ENVÍOS DEL DÍA
                    </div> */}
                    <div style={styles.product}>
                        {enviosToday.length > 0
                            ? showEnvioData(enviosToday)
                            : <p>
                                <h3>No hay envíos entregados en el día para mostrar.</h3>
                                <br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br />
                            </p>
                        }
                    </div>
                </div>)
                : (<div>
                    {/* <div className="tittle-style" style={{ fontSize: '35px', marginTop: '45px', marginBottom: '-30px' }}>
                        HISTORIAL DE ENVÍOS
                    </div>
                    <div style={styles.product}>
                        {envios.length > 0
                            ? showEnvioData(envios)
                            : <p>
                                <h3>No hay envíos entregados para mostrar.</h3>
                                <br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br />
                            </p>
                        }
                    </div> */}
                </div>)
            }
            <Modal show={showAlert} onHide={() => { setShowAlert(false); setProdsToShow([]) }}>
                <Modal.Header closeButton>
                    <Modal.Title>Aviso</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>{alertMsg}</p>
                    {/* {prodsToShow.length > 0 &&
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
                        </div>} */}
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