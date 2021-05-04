import React from 'react';
import './styles.css';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';

export default function Product({ title, price, oldPrice }) {
    return (
        <Card style={{ width: '20rem', height: '25rem', margin: "20px" }}>
            <Card.Img variant="top" src="holder.js/100px180" />
            <Card.Body>
                <Card.Title>Card Title</Card.Title>
                <Card.Text>
                    <span style={{ textDecoration: 'line-through', marginRight: '30px' }}>$250.00</span>
                    $195.00
                </Card.Text>
                <Button variant="dark">AGREGAR AL CARRITO</Button>
            </Card.Body>
        </Card>
    )
}