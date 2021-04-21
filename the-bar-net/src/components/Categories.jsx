import React from 'react';
import './styles.css';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

export default function Categories({ onSelectOfertas, onSelectCombos }) {
    const arrayCategoriesFstRow = [
        { name: 'cervezas', title: 'Cervezas' },
        { name: 'vinos', title: 'Vinos' },
        { name: 'espumantes', title: 'Espumantes' }
    ];
    const arrayCategoriesScndRow = [
        { name: 'vodka', title: 'Vodkas' },
        { name: 'whiskys', title: 'Whiskys' },
        { name: 'sin-alcohol', title: 'Sin Alcohol' }
    ];

    const handleClick = category => {
        console.log('category', category)
    }

    return (
        <Container>
            <Row>
                {
                    arrayCategoriesFstRow.map(item => {
                        return <Col className={"categories-col"} onClick={() => handleClick(item.name)} key={item.name}>
                            <div className={"categories-" + item.name}></div>
                            <h1 className={"categories-name"}> {item.title}</h1>
                        </Col>
                    })
                }
            </Row>
            <Row>
                {
                    arrayCategoriesScndRow.map(item => {
                        return <Col className={"categories-col"} onClick={() => handleClick(item.name)} key={item.name}>
                            <div className={"categories-" + item.name}></div>
                            <h1 className={"categories-name"}> {item.title}</h1>
                        </Col>
                    })
                }
            </Row>
        </Container>
    )
}