import React, { useCallback } from 'react';
import './styles.css';
import Carousel from 'react-bootstrap/Carousel';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { useHistory } from 'react-router';

export default function CarouselHome() {
    const history = useHistory();

    const onSelectCombos = useCallback(() => {
        history.push("/combos");
    }, [history]);

    const onSelectOfertas = useCallback(() => {
        history.push("/ofertas");
    }, [history]);
    
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
