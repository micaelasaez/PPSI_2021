import React, { useCallback, useContext, useEffect, useState } from 'react';
import { TheNetBar } from '../context/TheNetBarContext';
import '../styles.css';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import SignUp from '../Forms/SignUp';
import { TarjetasInput } from '../TarjetasInput';
import { TheBarNetServerUrl } from '../context/Url';
import { useHistory } from 'react-router-dom';

export const modalidadPago = [
    { id: 'efectivo', name: 'Efectivo' },
    { id: 'credito', name: 'Tarjeta de Crédito' },
    { id: 'debito', name: 'Tarjeta de Débito' }
];
export const modalidadEnvio = [
    { id: 'retiro', name: 'Retiro por Sucursal' },
    { id: 'envio', name: 'Envío a Domicilio' }
];

export default function FinalizarCompra() {
    const { productosCarrito, user, carritoTotal, token, setUser, setPedido, setCarrito, setCarritoTotal } = useContext(TheNetBar.Context);
    const [actualUser, setActualUser] = useState(user);
    const [cardCompleted, setCardCompleted] = useState(false);
    const [modalidadPagoSeleccionada, setModalidadPagoSeleccionada] = useState('efectivo');
    const [modalidadEnvioSeleccionada, setModalidadEnvioSeleccionada] = useState('retiro');
    const [eligioModalidadEnvio, setEligioModalidadEnvio] = useState(false);
    // const [showDatosEnvio, setShowDatosEnvio] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [showPedidoRegistrado, setShowPedidoRegistrado] = useState(false);
    const history = useHistory();

    const handleFinalizarCompra = useCallback((user) => {
        setShowModal(false);

        let fechaActual = new Date();
        const date = fechaActual.getFullYear() + '-' + (fechaActual.getMonth() + 1) + '-' + fechaActual.getDate();
        const time = fechaActual.getHours() + ":" + fechaActual.getMinutes() + ":" + fechaActual.getSeconds();
        fechaActual = date + ' ' + time;

        const pedido = {
            idUsuario: actualUser.id,
            fecha: fechaActual,
            total: carritoTotal,
            tipoEnvio: modalidadEnvioSeleccionada,
            modalidadPago: modalidadPagoSeleccionada,
            estado: modalidadPagoSeleccionada === 'efectivo' ? 'sin_pagar' : 'pagado'
        }

        fetch(TheBarNetServerUrl.pedido, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            mode: 'cors', // no-cors
            body: JSON.stringify(pedido)
        }).then(res => res.json())
            .then(response => {
                setPedido(pedido);
                setShowPedidoRegistrado(true);
                setCarrito([], 0);
                setCarritoTotal(0);
            });

        // alert(JSON.stringify(pedido))
        // setActualUser(user);
        // setCompleteUserData(true);
        // console.log('end', user)

    }, [actualUser.id, carritoTotal, modalidadEnvioSeleccionada, modalidadPagoSeleccionada, setCarrito, setCarritoTotal, setPedido]);

    const handleSaveuserData = useCallback((user) => {
        setEligioModalidadEnvio(true);
        setShowModal(true)
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
                    console.log('token decoded', userProfile)
                    setActualUser(userProfile);
                    setUser(userProfile);
                });
        }
    }, [productosCarrito, setUser, token]);

    const ShowPedidoInformation = () => (
        <Card style={{
            width: showModal ? '100%' : '35%',
            height: "fit-content",
            // marginTop: '50px'
        }}>
            <Card.Body>
                <Card.Title>
                    <h5>Tu Pedido</h5>
                </Card.Title>
                <br />
                {productosCarrito.map(pCarrito =>
                    <p>
                        {pCarrito.p.nombre} - {pCarrito.p.cantidad}
                        <br />{pCarrito.cantidad} x $ {pCarrito.p.precio}
                        <hr />
                    </p>
                )}
                <br />
                <Card.Text>
                    Subtotal ${' ' + carritoTotal}
                </Card.Text>
                {/* {completeUserData && <> */}
                <hr />
                <Card.Text>
                    Modalidad de pago elegida: {' ' + (modalidadPago.find(mp => mp.id === modalidadPagoSeleccionada)).name}
                </Card.Text>
                {/* </>} */}
                {eligioModalidadEnvio && <>
                    <hr />
                    <Card.Text>
                        Modalidad de envío elegida: {' ' + (modalidadEnvio.find(mE => mE.id === modalidadEnvioSeleccionada)).name}
                    </Card.Text>
                </>}
            </Card.Body>
        </Card>
    )
    return (
        <div>
            <br /><h3 className="tittle-style">Finalizar Compra</h3><br />
            <div style={{ display: 'flex', justifyContent: "space-around" }}>
                <div style={{ width: "50%" }}>
                    <h3>Modalidad de Pago</h3>
                    <br />
                    <div style={{ display: 'flex', justifyContent: 'space-around' }}>
                        <div style={{ width: '55%' }}>
                            {modalidadPago.map(mPago =>
                                <div key={mPago.id} className="mb-3">
                                    <Form.Check
                                        type={'radio'}
                                        id={mPago.id}
                                        label={mPago.name}
                                        checked={mPago.id === modalidadPagoSeleccionada}
                                        onChange={value => setModalidadPagoSeleccionada(value.target.id)}
                                    />
                                </div>
                            )}
                        </div>
                        {modalidadPagoSeleccionada !== 'efectivo' && <TarjetasInput handleValidData={() => setCardCompleted(true)} />}
                    </div>
                    <div>
                        <br /><h3>Modalidad de Envío</h3><br />
                        {modalidadEnvio.map(mEnvio =>
                            <div key={mEnvio.id} className="mb-3">
                                <Form.Check
                                    type={'radio'}
                                    id={mEnvio.id}
                                    label={mEnvio.name}
                                    checked={mEnvio.id === modalidadEnvioSeleccionada}
                                    onChange={value => setModalidadEnvioSeleccionada(value.target.id)}
                                />
                            </div>
                        )}
                        <br /><br />
                        <h3>Datos de {modalidadEnvioSeleccionada === 'retiro' ? 'Facturación' : 'Envío'}</h3>
                        {actualUser.nombre && (
                            <SignUp adminMode finalizarCompra
                                handleFinalizarCompra={handleSaveuserData}
                                user={actualUser
                                    //     {
                                    //     tipo: "encargado",
                                    //     nombre: "Micaela",
                                    //     apellido: "Saez",
                                    //     dni: 32874908,
                                    //     cuit: 11328749081,
                                    //     email: "micaaelasaez@gmail.com",
                                    //     password: "micabarnet",
                                    //     telefono: 1134091414,
                                    //     direccion: "Del Valle Iberlucea 2645",
                                    //     localidad: "Lanús",
                                    //     provincia: "Buenos Aires",
                                    //     codigoPostal: 1826
                                }
                                showDatosEnvio={modalidadEnvioSeleccionada === 'envio'}
                                continuarDisabled={modalidadPagoSeleccionada !== 'efectivo' && !cardCompleted}
                            />
                        )}
                    </div>
                </div>
                <ShowPedidoInformation />
                <Modal show={showModal}>
                    <Modal.Header>
                        <Modal.Title>Confirmación de Pedido Registrado</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <ShowPedidoInformation />
                        <br />
                    </Modal.Body>
                    <Modal.Footer style={{ display: 'flex', justifyContent: 'space-around' }}>
                        <Button variant="danger" onClick={() => setShowModal(false)}>Editar Pedido</Button>
                        <Button variant="primary" onClick={handleFinalizarCompra} >
                            Aceptar
                        </Button>
                    </Modal.Footer>
                </Modal>
                <Modal show={showPedidoRegistrado} onHide={() => setShowPedidoRegistrado(false)}>
                    <Modal.Header closeButton>
                        <Modal.Title>Pedido Registrado</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <p>Gracias por tu compra!</p>
                        <br />
                        <p>Tu pedido ya se encuentra registrado, podes seguir su estado desde la sección de Mis Pedidos!</p>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => history.push("/home")}>
                            Volver a la página principal
                        </Button>
                        <Button variant="primary" onClick={() => history.push("/mis-pedidos")}>
                            Ir a Mis Pedidos
                        </Button>
                    </Modal.Footer>
                </Modal>
            </div>
        </div>
    )
}