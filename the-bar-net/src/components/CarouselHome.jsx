import React from 'react';
import './styles.css';
import Carousel from 'react-bootstrap/Carousel';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import bannerOfertas from "../utils/images/banner_ofertas.png";
import bannerCombos from "../utils/images/banner_combos.png";

export default function CarouselHome({onSelectOfertas, onSelectCombos}) {
    return (
        <Container fluid>
            <Row className="justify-content-md-center">
                <Col md="auto">
                    <Carousel>
                        <Carousel.Item onClick={onSelectOfertas}>
                            <img
                                src={bannerOfertas}
                                alt="Ofertas"
                            />
                            <Carousel.Caption>
                                <p>Ver ofertas disponibles del sitio.</p>
                            </Carousel.Caption>
                        </Carousel.Item>
                        <Carousel.Item onClick={onSelectCombos}>
                            <img
                                src={bannerCombos}
                                alt="Combos"
                            />
                            <Carousel.Caption>
                                <p>Ver los combos disponibles del sitio.</p>
                            </Carousel.Caption>
                        </Carousel.Item>
                    </Carousel>
                </Col>
            </Row>
        </Container>
    )
};
