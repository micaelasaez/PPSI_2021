import React, { useCallback, useEffect, useState } from 'react';
import './styles.css';
import Table from 'react-bootstrap/Table';
import { TheBarNetServerUrl } from './context/Url';
import Badge from 'react-bootstrap/Badge';
import Button from 'react-bootstrap/Button';
import { useHistory } from 'react-router';
import SignUp from './Forms/SignUp';
import Modal from 'react-bootstrap/Modal';

export default function ShowUsuarios({ type }) {
    /**tipo: [admin, encargado, empleado, cliente] */
    const [users, setUsers] = useState([]);
    const [showEditUser, setShowEditUser] = useState(null);
    const history = useHistory();
    
    const getUsers = async () => {
        fetch(TheBarNetServerUrl.users, {
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

    const handleDelete = useCallback((e) => {

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
                                <td>{user.estaBloqueado
                                    ? <Badge pill bg="danger">Si</Badge>
                                    : <Badge pill bg="success">No</Badge>
                                }</td>
                                <td>
                                    <Button variant="link" style={{ color: '#1d1026' }} onClick={() => handleEdit(user)}>
                                        Editar
                                    </Button>
                                </td>
                                <td>
                                    <Button variant="link" style={{ color: '#1d1026' }} onClick={handleDelete}>
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
                <Modal.Body>
                    <SignUp user={showEditUser}/>
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
        </>
    )
}