import React, { useCallback, useEffect, useState } from 'react';
import './styles.css';
import Table from 'react-bootstrap/Table';
import { TheBarNetServerUrl } from './context/Url';
import Figure from 'react-bootstrap/Figure';
import Button from 'react-bootstrap/Button';
import SignUp from './Forms/SignUp';
import Modal from 'react-bootstrap/Modal';
import deleteIcon from "../utils/images/delete-photo.svg";
import editIcon from "../utils/images/edit-photo.svg";
import blockedIcon from "../utils/images/blocked-photo.svg";
import notBlockedIcon from "../utils/images/not-blocked-photo.svg";
import { useMemo } from 'react';
import { modalidadEnvio, modalidadPago } from './pages/FinalizarCompra';
import { estadosPedido } from './pages/MisPedidos';

export default function ShowUsuarios({ type, showListNoConfiables = false }) {
    /**tipo: [admin, encargado, empleado, cliente] */
    const [users, setUsers] = useState([]);
    const [showEditUser, setShowEditUser] = useState(null);
    // const history = useHistory();
    const [showAlert, setShowAlert] = useState(false);
    const [alertMsg, setAlertMsg] = useState('');
    const [pedidosUsuarioSeleccionado, setPedidosUsuarioSeleccionado] = useState(null);

    const getUsers = async () => {
        fetch(TheBarNetServerUrl.usersType + type, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
            mode: 'cors'
        })
            .then(res => res.json())
            .catch(error => console.error('Error:', error))
            .then(response => {
                console.log(response);
                let usersArr = response.rta;
                setUsers([]);
                fetch(TheBarNetServerUrl.preciosEnvios, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    mode: 'cors'
                }).then(res => res.json())
                    .then(response => {
                        const localidades = response.rta;
                        usersArr = usersArr.map(u => {
                            const localidadName = localidades.find(l => l.id === Number.parseInt(u.localidad))?.localidad;
                            return { ...u, localidad: localidadName};
                        })

                        if (Array.isArray(usersArr) && usersArr.length > 0) {
                            if (!showListNoConfiables) {
                                setUsers(usersArr);
                            } else {
                                const noConfiablesList = usersArr.filter(u => u.confiable === 'no');
                                console.log(noConfiablesList)
                                setUsers(noConfiablesList);
                            }
                        } else {
                            setUsers([]);
                        }
                    });
            });
    }

    useEffect(() => {
        getUsers();
    }, [showListNoConfiables]);

    const handleDelete = useCallback((user) => {
        console.log('delete', user)
        fetch(TheBarNetServerUrl.users + '/' + user.id, {
            mode: 'cors',
            method: 'DELETE'
        }).then(res => res.json())
            .then(response => {
                // console.log(response);
                setAlertMsg('Usuario borrado correctamente!');
                setShowAlert(true);
                getUsers();
            })
            .catch(() => {
                setAlertMsg('Algo falló borrando el usuario!');
                setShowAlert(true);
            });
    }, []);

    const handleClose = useCallback(() => {
        getUsers();
        setShowEditUser(null);
    }, []);

    const handleEdit = useCallback((user) => {
        console.log('edit', user)
        setShowEditUser(user);
    }, []);

    const handleEditClose = useCallback((msg) => {
        handleClose();
        setAlertMsg(msg);
        setShowAlert(true);
    }, [handleClose]);

    const handleOnSelect = useCallback(user => {
        console.log(user)
        if (type === 'cliente') {
            fetch(TheBarNetServerUrl.pedidosUsuario + user.id, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                },
                mode: 'cors'
            })
                .then(res => res.json())
                .catch(error => console.error('Error:', error))
                .then(response => {
                    console.log(response);
                    setPedidosUsuarioSeleccionado(response.rta);
                    setAlertMsg('');
                    setShowAlert(true);
                });
        }
    }, [type]);

    const pedidosUsuario = useMemo(() => {
        if (pedidosUsuarioSeleccionado === null || type !== 'cliente') {
            return <div></div>
        }
        return (
            pedidosUsuarioSeleccionado.length > 0
                ? <div>
                    <Table responsive>
                        <thead>
                            <tr>
                                <th>Fecha</th> <th>Total</th> <th>Tipo de Envío</th> <th>Modalidad de Pago</th> <th>Estado del Pedido</th>
                            </tr>
                        </thead>
                        <tbody>
                            {   // pedido usuario seleccionado
                                // estado: "pagado"
                                // fecha: "2021-6-27 1:17:16"
                                // id: 11
                                // modalidadPago: "credito"
                                // tipoEnvio: "retiro"
                                // total: 1570
                            }
                            {(Array.isArray(pedidosUsuarioSeleccionado) && pedidosUsuarioSeleccionado.length > 0)
                                && pedidosUsuarioSeleccionado.map(p => {
                                    return <tr key={p.id} className="table-row">
                                        <td>{p.fecha}</td>
                                        <td>{p.total}</td>
                                        <td>{(modalidadEnvio.find(mEnvio => mEnvio.id === p.tipoEnvio)).name}</td>
                                        <td>{(modalidadPago.find(mPago => mPago.id === p.modalidadPago)).name}</td>
                                        <td>{(estadosPedido.find(e => e.key === p.estado)).title}</td>
                                    </tr>
                                })
                            }
                        </tbody>
                    </Table>
                </div>
                : <div>
                    <h6>El usuario seleccionado no ha realizado pedidos en el sistema!</h6>
                </div>
        )
    }, [pedidosUsuarioSeleccionado, type]);

    return (
        <>
            <h1 className="tittle-style" style={{ marginBottom: "30px", fontSize: "25px", marginTop: "40px" }}>{type.toUpperCase()}</h1>
            {showListNoConfiables && <div className="tittle-style" style={{ marginBottom: "30px", fontSize: "26px", textShadow: '2px 2px #df0b0b' }} >
                LISTA DE NO CONFIABLES</div>}
            {(Array.isArray(users) && users.length > 0)
                ?
                <Table responsive>
                    <thead>
                        <tr>
                            <th>Nombre</th> <th>Apellido</th>
                            <th>DNI</th> <th>CUIT</th>
                            <th>Email</th> <th>Telefono</th>
                            <th>Dirección</th> <th>Localidad</th> <th>Provincia</th> <th>CP</th>
                            <th>¿Es confiable?</th> <th>Editar</th> <th>Eliminar</th>
                        </tr>
                    </thead>
                    <tbody>
                        {(Array.isArray(users) && users.length > 0)
                            && users.map(user => {
                                if (showListNoConfiables && user.confiable === 'yes') {
                                    return <></>;
                                }
                                return <tr key={user.nombre} className="table-row">
                                    {/* <div onClick={() => handleOnSelect(user)}> */}
                                        <td onClick={() => handleOnSelect(user)}>{user.nombre}</td>
                                        <td onClick={() => handleOnSelect(user)}>{user.apellido}</td>
                                        <td onClick={() => handleOnSelect(user)}>{user.dni}</td>
                                        <td onClick={() => handleOnSelect(user)}>{user.cuit}</td>
                                        <td onClick={() => handleOnSelect(user)}>{user.email}</td>
                                        <td onClick={() => handleOnSelect(user)}>{user.telefono}</td>
                                        <td onClick={() => handleOnSelect(user)}>{user.direccion}</td>
                                        <td onClick={() => handleOnSelect(user)}>{user.localidad}</td>
                                        <td onClick={() => handleOnSelect(user)}>{user.provincia}</td>
                                        <td onClick={() => handleOnSelect(user)}>{user.codigoPostal}</td>
                                    {/* </div> */}
                                    <td>
                                        {
                                            user.confiable === 'yes'
                                                ? <Figure onClick={() => handleEdit(user)}>
                                                    <Figure.Image
                                                        width={40}
                                                        height={40}
                                                        alt="171x180"
                                                        src={notBlockedIcon}
                                                    />
                                                </Figure>
                                                : <Figure onClick={() => handleEdit(user)}>
                                                    <Figure.Image
                                                        width={40}
                                                        height={40}
                                                        alt="171x180"
                                                        src={blockedIcon}
                                                    />
                                                </Figure>
                                        }
                                    </td>
                                    <td>
                                        <Figure onClick={() => handleEdit(user)}>
                                            <Figure.Image
                                                width={40}
                                                height={40}
                                                alt="171x180"
                                                src={editIcon}
                                            />
                                            {/* <h6>EDITAR</h6> */}
                                        </Figure>
                                    </td>
                                    <td>
                                        <Figure onClick={() => handleDelete(user)}>
                                            <Figure.Image
                                                width={40}
                                                height={40}
                                                alt="171x180"
                                                src={deleteIcon}
                                            />
                                            {/* <h6>ELIMINAR</h6> */}
                                        </Figure>
                                    </td>
                                </tr>
                            })
                        }
                    </tbody>
                </Table>
                : <div>
                    <h4>No hay usuarios en esta categoría!</h4>
                    <br/><br/><br/>
                </div>
            }
            <Modal show={showEditUser !== null} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Editar Usuario</Modal.Title>
                </Modal.Header>
                <Modal.Body style={{ backgroundColor: '#4c2882' }}>
                    <SignUp user={showEditUser} empleadoMode close={handleEditClose} />
                </Modal.Body>
            </Modal>
            <Modal show={showAlert} onHide={() => { setShowAlert(false); setPedidosUsuarioSeleccionado([]); }} size='lg'>
                <Modal.Header closeButton>
                    <Modal.Title>Aviso</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>{alertMsg}</p>
                    {(pedidosUsuarioSeleccionado !== null && type === 'cliente') &&
                        pedidosUsuario}
                </Modal.Body>
                <Modal.Footer>
                    {/* window.location.reload(); */}
                    <Button variant="primary" onClick={() => { setShowAlert(false); setPedidosUsuarioSeleccionado([]); }}>
                        Volver
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}