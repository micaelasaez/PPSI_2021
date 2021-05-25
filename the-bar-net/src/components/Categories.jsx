import React from 'react';
import './styles.css';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { useHistory } from 'react-router';

export default function Categories() {
    const history = useHistory();

    const arrayCategoriesFstRow = [
        { name: 'cervezas', title: 'CERVEZAS' },
        { name: 'vinos', title: 'VINOS' },
        { name: 'espumantes', title: 'ESPUMANTES' }
    ];
    const arrayCategoriesScndRow = [
        { name: 'vodka', title: 'VODKAS' },
        { name: 'whiskys', title: 'WHISKYS' },
        { name: 'sin-alcohol', title: 'SIN ALCOHOL' }
    ];

    const handleClick = category => {
        history.push({ 
            pathname: "/show-productos",
            state: category
        });
    }

    return (
        <Container>
            <Row>
                {
                    arrayCategoriesFstRow.map(item => {
                        return <Col className={"categories-col"} onClick={() => handleClick(item)} key={item.name}>
                            <div className={"categories-" + item.name}></div>
                            <h1 className={"categories-name"}> {item.title}</h1>
                        </Col>
                    })
                }
            </Row>
            <Row>
                {
                    arrayCategoriesScndRow.map(item => {
                        return <Col className={"categories-col"} onClick={() => handleClick(item)} key={item.name}>
                            <div className={"categories-" + item.name}></div>
                            <h1 className={"categories-name"}> {item.title}</h1>
                        </Col>
                    })
                }
            </Row>
        </Container>
    )
}