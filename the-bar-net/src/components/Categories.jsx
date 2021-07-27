import React, { useEffect, useState } from 'react';
import './styles.css';
import { useHistory } from 'react-router';
import { TheBarNetServerUrl } from './context/Url';
import Figure from 'react-bootstrap/Figure';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { useCallback } from 'react';

export default function Categories({ disableSelect = false }) {
    const history = useHistory();
    const [categorias, setCategorias] = useState([]);
    const [showAlert, setShowAlert] = useState(false);
    const [alertMsg, setAlertMsg] = useState('');

    // const arrayCategoriesFstRow = [
    //     { name: 'cervezas', title: 'CERVEZAS' },
    //     { name: 'vinos', title: 'VINOS' },
    //     { name: 'espumantes', title: 'ESPUMANTES' }
    // ];
    // const arrayCategoriesScndRow = [
    //     { name: 'vodka', title: 'VODKAS' },
    //     { name: 'whiskys', title: 'WHISKYS' },
    //     { name: 'sin_alcohol', title: 'SIN ALCOHOL' }
    // ];

    const handleClick = category => {
        if (!disableSelect) {
            // console.log(category.id)
            history.push({
                pathname: "/show-productos",
                state: { 
                    categoryId: category.id,
                    title: (category.nombre).toUpperCase()
                }
            });
        }
    }
    const handleDelete = useCallback(category => {
        // console.log('delete', category);
        fetch(TheBarNetServerUrl.categorias + `/${category.id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            mode: 'cors'
        }).then(res => res.json())
            .then(response => {
                // console.log(response);
                if (response.rta === 'deleted') {
                    setAlertMsg('La categoría fue eliminada correctamente');
                } else {
                    setAlertMsg('Algo falló eliminando la categoría.');
                }
                setShowAlert(true);
                fetch(TheBarNetServerUrl.categorias, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    mode: 'cors'
                }).then(res => res.json())
                    .then(response => {
                        setCategorias(response.rta)
                    })
            });
    }, []);

    useEffect(() => {
        fetch(TheBarNetServerUrl.categorias, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
            mode: 'cors'
        }).then(res => res.json())
            .then(response => {
                // console.log('categorias', response.rta);
                setCategorias(response.rta)
                /*  CATEGORIA
                    foto: "http://localhost:4200/uploads/vinos.jpg"
                    id: 1
                    nombre: "Vinos y espumantes"
                */
            });
    }, [disableSelect]);

    return (
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-around', width: '100%' }}>
            {categorias.length > 0 &&
                categorias.map(categoria => (
                    <div key={categoria.id} style={{ display: 'flex', flexDirection: 'column' }}>
                        <div style={{
                            width: '270px',
                            fontSize: '40px',
                            fontWeight: 500,
                            color: 'white',
                            zIndex: 1,
                            position: 'absolute',
                            marginTop: '90px',
                            marginLeft: '20px',
                            backgroundColor: 'black'
                        }}
                            className='tittle-style'
                            onClick={() => handleClick(categoria)}
                        >
                            {(categoria.nombre).toUpperCase()}
                        </div>
                        <Figure style={{ margin: '20px' }} onClick={() => handleClick(categoria)} >
                            <Figure.Image
                                width={350}
                                height={350}
                                alt={categoria.nombre}
                                src={categoria.foto}
                                className={"cat-container"}
                            />
                        </Figure>
                        {disableSelect &&
                            <Button variant="danger" onClick={() => handleDelete(categoria)} style={{ marginBottom: '80px' }} >
                                ELIMINAR CATEGORÍA
                            </Button>
                        }
                    </div>
                ))
            }
            {/* <Row>
                {
                    arrayCategoriesFstRow.map(item => {
                        return <Col className={"categories-col"} onClick={() => handleClick(item)} key={item.name}>
                            <div className={"categories-" + item.name}></div>
                            <div className={"categories-name"}> {item.title}</div>
                        </Col>
                    })
                }
            </Row>
            <Row>
                {
                    arrayCategoriesScndRow.map(item => {
                        return <Col className={"categories-col"} onClick={() => handleClick(item)} key={item.name}>
                            <div className={"categories-" + item.name}></div>
                            <div className={"categories-name"}> {item.title}</div>
                        </Col>
                    })
                }
            </Row> */}
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
        </div >
    )
}