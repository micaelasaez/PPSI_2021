import React from 'react';
import './styles.css';
import Carousel from 'react-bootstrap/Carousel';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

export default function CarouselHome({onSelectOfertas, onSelectCombos}) {
    return (
        <Container fluid>
            <Row className="justify-content-md-center">
                <Col md="auto">
                    <Carousel>
                        <Carousel.Item onClick={onSelectOfertas} className={"carrousel-item"}>
                            <div className={"img-carrousel-ofertas"} />
                            <Carousel.Caption>
                                <h3>Ver ofertas disponibles del sitio.</h3>
                            </Carousel.Caption>
                        </Carousel.Item>
                        <Carousel.Item onClick={onSelectCombos} className={"carrousel-item"}>
                            <div className={"img-carrousel-combos"} />
                            <Carousel.Caption>
                                <h3>Ver los combos disponibles del sitio.</h3>
                            </Carousel.Caption>
                        </Carousel.Item>
                    </Carousel>
                </Col>
            </Row>
        </Container>
    )
};
