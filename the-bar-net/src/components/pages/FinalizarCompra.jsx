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
import Sucursal from '../Sucursal';

export const modalidadPago = [
    { id: 'efectivo', name: 'Efectivo' },
    { id: 'credito', name: 'Tarjeta de Crédito' },
    { id: 'debito', name: 'Tarjeta de Débito' }
];
export const modalidadEnvio = [
    { id: 'retiro', name: 'Retiro por Sucursal' },
    { id: 'envio', name: 'Envío a Domicilio' }
];

const descuentos = [
    { string: '5%', number: 0.05 },
    { string: '10%', number: 0.1 },
    { string: '15%', number: 0.15 },
    { string: '20%', number: 0.2 },
    { string: '25%', number: 0.25 },
    { string: '30%', number: 0.3 },
    { string: '35%', number: 0.35 }
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
    const [preciosEnvio, setPreciosEnvio] = useState([]);
    const [descuentoBancario, setDescuentoBancario] = useState(0);
    const [totalReal, setTotalReal] = useState(0);

    const handleFinalizarCompra = useCallback((userFinalizarCompra, cargoPorEnvio) => {
        setShowModal(false);

        let fechaActual = new Date();
        const date = fechaActual.getFullYear() + '-' + (fechaActual.getMonth() + 1) + '-' + fechaActual.getDate();
        const time = fechaActual.getHours() + ":" + fechaActual.getMinutes() + ":" + fechaActual.getSeconds();
        fechaActual = date + ' ' + time;

        const idsProducto = [];

        productosCarrito.forEach(pc => {
            for (let index = 0; index < pc.cantidad; index++) {
                if (pc.p.idCombo !== undefined) {
                    pc.p.productos.forEach(pcProds => {
                        for (let index = 0; index < pcProds.cantidad; index++) {
                            idsProducto.push((pcProds.idProducto).toString());
                        }
                    });
                } else {
                    idsProducto.push((pc.p.id).toString());
                }
            }
        });

        console.log(productosCarrito)

        const pedido = {
            idUsuario: user.id,
            fecha: fechaActual,
            total: totalReal,
            tipoEnvio: modalidadEnvioSeleccionada,
            modalidadPago: modalidadPagoSeleccionada,
            estado: modalidadPagoSeleccionada === 'efectivo' ? 'sin_pagar' : 'pagado'
        }
        // if (modalidadEnvioSeleccionada === 'envio') {
        //     pedido.total += preciosEnvio.find(pEnvio => pEnvio.id === Number.parseInt(actualUser.localidad))?.precio;
        // }
        console.log(pedido)

        fetch(TheBarNetServerUrl.pedido, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            mode: 'cors', // no-cors
            body: JSON.stringify(pedido)
        }).then(res => res.json())
            .then(response => {
                console.log('ped', response)
                pedido.id = response.idPedido;
                fetch(TheBarNetServerUrl.addPedProd + response.idPedido, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    mode: 'cors', // no-cors
                    body: JSON.stringify({ idsProducto: idsProducto })
                }).then(res => res.json())
                    .then(response => {
                        console.log('ped-prod', response)
                        setPedido(pedido);
                        setShowPedidoRegistrado(true);
                        setCarrito([], 0);
                        setCarritoTotal(0);
                    })
            })
            .catch((e) =>
                console.log(e)
            );
    }, [modalidadEnvioSeleccionada, modalidadPagoSeleccionada, productosCarrito, setCarrito, setCarritoTotal, setPedido, totalReal, user.id]);

    const handleSaveuserData = useCallback((user) => {
        setActualUser(user)
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
                    fetch(TheBarNetServerUrl.preciosEnvios, {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        mode: 'cors'
                    }).then(res => res.json())
                        .then(response => {
                            setPreciosEnvio(response.rta);
                        });
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
                <hr />
                <Card.Text>
                    Modalidad de envío elegida: {' ' + (modalidadEnvio.find(mE => mE.id === modalidadEnvioSeleccionada)).name}
                </Card.Text>
                {modalidadEnvioSeleccionada === 'envio' && <>
                    <Card.Text>
                        <b>Cargo por envío:</b> {' $' + preciosEnvio.find(pEnvio => pEnvio.id === Number.parseInt(actualUser.localidad))?.precio}
                    </Card.Text>
                </>}
                {descuentoBancario !== 0 && <>
                    <Card.Text>
                        Descuento por promo bancaria: {descuentoBancario}
                    </Card.Text>
                </>}
                <hr />
                <Card.Text>
                    <b>Total:</b> ${' ' + totalReal}
                </Card.Text>
            </Card.Body>
        </Card>
    )

    // useEffect(() => {
    //     const precio = preciosEnvio.find(pEnvio => pEnvio.id === Number.parseInt(actualUser.localidad))?.precio;
    //     if (precio) {
    //         setCargoEnvio(precio);
    //     }
    // }, [actualUser, preciosEnvio]);

    useEffect(() => {
        const tot = Number.parseInt(carritoTotal) + (
            modalidadEnvioSeleccionada === 'envio'
                ? Number.parseInt(preciosEnvio.find(pEnvio => pEnvio.id === Number.parseInt(actualUser.localidad))?.precio)
                : 0
        ) - (
                descuentoBancario !== 0
                    ? Number.parseInt(carritoTotal * (
                        descuentos.find(d => {
                            return d.string === descuentoBancario
                        })?.number
                        || 0
                    ))
                    : 0
            );
        setTotalReal(tot);
    }, [actualUser.localidad, carritoTotal, descuentoBancario, modalidadEnvioSeleccionada, preciosEnvio])

    const handleValidData = useCallback((descuento) => {
        if (descuento !== '') {
            setDescuentoBancario(descuento);
        } else {
            setDescuentoBancario(0);
        }
        setCardCompleted(true);
    }, []);

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
                                        onChange={value => {
                                            setModalidadPagoSeleccionada(value.target.id);
                                            setDescuentoBancario(0);
                                        }}
                                    />
                                </div>
                            )}
                        </div>
                        {modalidadPagoSeleccionada !== 'efectivo' &&
                            <TarjetasInput
                                handleValidData={handleValidData}
                                modalidadPagoSeleccionada={modalidadPagoSeleccionada}
                            />}
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
                        <br />
                        {modalidadEnvioSeleccionada === 'retiro'
                            && <div style={{ width: '70%' }}>
                                <Sucursal />
                            </div>
                        }
                        <br />
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