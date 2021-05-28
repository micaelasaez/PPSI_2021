import React, { useEffect, useState } from 'react';
import './styles.css';
import Table from 'react-bootstrap/Table';
import { TheBarNetServerUrl } from './context/Url';
import Badge from 'react-bootstrap/Badge';
import Button from 'react-bootstrap/Button';

const usersMock = [
    { nombre: 'Micaela Saez', email: 'micaaelasaez@gmail.com', telefono: 111111111, direccion: "9 de julio 999", localidad: 'Lanús Este', provincia: 'Buenos Aires', estaBloqueado: false }
];

export default function ShowUsuarios({ type }) {
    /**tipo: [admin, encargado, empleado, cliente] */
    const [users, setUsers] = useState([]);

    const getUsers = async () => {
        const response = await fetch(TheBarNetServerUrl.users + '/' + type, {
            mode: 'no-cors'
        });
        console.log(response);
    }

    useEffect(() => {
        // getUsers()
        setUsers(usersMock);
    }, []);

    return (
        <>
            <h1 className="tittle-style" style={{ marginBottom: "30px", fontSize: "25px", marginTop: "40px" }}>{type.toUpperCase()}</h1>
            <Table responsive>
                <thead>
                    <tr>
                        <th>Nombre</th>
                        <th>Email</th>
                        <th>Telefono</th>
                        <th>Dirección</th>
                        <th>Localidad</th>
                        <th>Provincia</th>
                        <th>Bloqueado</th>
                        <th>Editar</th>
                        <th>Eliminar</th>
                    </tr>
                </thead>
                <tbody>
                    {(Array.isArray(users) && users.length > 0)
                        && users.map(user => {
                            return <tr>
                                <td>{user.nombre}</td>
                                <td>{user.email}</td>
                                <td>{user.telefono}</td>
                                <td>{user.direccion}</td>
                                <td>{user.localidad}</td>
                                <td>{user.provincia}</td>
                                <td>{user.estaBloqueado 
                                    ? <Badge pill bg="danger">Si</Badge>
                                    : <Badge pill bg="success">No</Badge>
                                }</td>
                                <td>
                                    <Button variant="link" style={{ color: '#1d1026' }}>
                                        Editar
                                    </Button>
                                </td>
                                <td>
                                    <Button variant="link" style={{ color: '#1d1026' }}>
                                        Eliminar
                                    </Button>
                                </td>
                            </tr>
                        })
                    }
                </tbody>
            </Table>
        </>
    )
}