import React, { useCallback, useEffect, useState } from 'react';
import './styles.css';
import Table from 'react-bootstrap/Table';
import { TheBarNetServerUrl } from './context/Url';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { useHistory } from 'react-router';
import SignUp from './Forms/SignUp';
import Modal from 'react-bootstrap/Modal';

export default function ShowUsuarios({ type }) {
    /**tipo: [admin, encargado, empleado, cliente] */
    const [users, setUsers] = useState([]);
    const [showEditUser, setShowEditUser] = useState(null);
    // const history = useHistory();
    const [showAlert, setShowAlert] = useState(false);
    const [alertMsg, setAlertMsg] = useState('');

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
                const usersArr = response.rta;
                if (Array.isArray(usersArr) && usersArr.length > 0) {
                    setUsers(usersArr);
                } else {
                    setUsers([]);
                }
            });
    }

    useEffect(() => {
        getUsers();
    }, []);

    const handleDelete = useCallback((user) => {
        console.log('delete', user)
        fetch(TheBarNetServerUrl.users + '/' + user.id, {
            mode: 'cors',
            method: 'DELETE'
        }).then(res => res.json())
            .then(response => {
                console.log(response);
                // alert('borrada')
                setAlertMsg('Usuario borrado correctamente!');
                setShowAlert(true);
                getUsers();
            })
            .catch(() => {
                setAlertMsg('Algo falló borrando el usuario!');
                setShowAlert(true);
            });
    }, []);
    
    const handleOnChangeEstaBloqueado = useCallback((e) => {

    }, []);
    
    const handleClose = useCallback(() => {
        setShowEditUser(null);
    }, []);

    const handleEdit = useCallback((user) => {
        console.log('edit', user)
        setShowEditUser(user);
    }, []);

    return (
        <>
            <h1 className="tittle-style" style={{ marginBottom: "30px", fontSize: "25px", marginTop: "40px" }}>{type.toUpperCase()}</h1>
            <Table responsive>
                <thead>
                    <tr>
                        <th>Nombre</th> <th>Apellido</th>
                        <th>DNI</th> <th>CUIT</th>
                        <th>Email</th> <th>Telefono</th>
                        <th>Dirección</th> <th>Localidad</th> <th>Provincia</th> <th>CP</th>
                        <th>Bloqueado</th> <th>Editar</th> <th>Eliminar</th>
                    </tr>
                </thead>
                <tbody>
                    {(Array.isArray(users) && users.length > 0)
                        && users.map(user => {
                            return <tr key={user.nombre} className="table-row">
                                <td>{user.nombre}</td>
                                <td>{user.apellido}</td>
                                <td>{user.dni}</td>
                                <td>{user.cuit}</td>
                                <td>{user.email}</td>
                                <td>{user.telefono}</td>
                                <td>{user.direccion}</td>
                                <td>{user.localidad}</td>
                                <td>{user.provincia}</td>
                                <td>{user.codigoPostal}</td>
                                <td>{
                                // user.estaBloqueado
                                //     ? <Badge pill bg="danger">Si</Badge>
                                //     : <Badge pill bg="success">No</Badge>
                                    // <Form.Check 
                                    //     type='checkbox'
                                    //     id='confiable'
                                    //     checked={user.estaBloqueado}
                                    //     onChange={() => handleOnChangeEstaBloqueado}
                                    //     label={
                                            
                                    'NO'

                                    // user.confiable === 'yes' ? 'NO' : 'SI'}
                                    
                                    
                                    /* />} */}
                                </td>
                                <td>
                                    <Button variant="link" style={{ color: '#1d1026' }} onClick={() => handleEdit(user)}>
                                        Editar
                                    </Button>
                                </td>
                                <td>
                                    <Button variant="link" style={{ color: '#1d1026' }} onClick={() => handleDelete(user)}>
                                        Eliminar
                                    </Button>
                                </td>
                            </tr>
                        })
                    }
                </tbody>
            </Table>
            <Modal show={showEditUser !== null} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Editar Usuario</Modal.Title>
                </Modal.Header>
                <Modal.Body  style={{ backgroundColor: '#4c2882' }}>
                    <SignUp user={showEditUser} empleadoMode close={handleClose}/>
                </Modal.Body>
                {/* <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Close
                </Button>
                <Button variant="primary" onClick={handleClose}>
                    Save Changes
                </Button>
                </Modal.Footer> */}
            </Modal>
            <Modal show={showAlert} onHide={() => setShowAlert(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Aviso</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>{alertMsg}</p>
                </Modal.Body>
                <Modal.Footer>
                    {/* window.location.reload(); */}
                    <Button variant="primary" onClick={() => setShowAlert(false)}>
                        Volver
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}