import React from 'react';
import './styles.css';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';

export default function Product({ title, price, oldPrice, addCarrito, id }) {

    return (
        <Card style={{ width: '20rem', height: '25rem', margin: "20px" }}>
            <Card.Img variant="top" src="holder.js/100px180" />
            <Card.Body>
                <Card.Title>{title}</Card.Title>
                <Card.Text>
                    {oldPrice && <span style={{ textDecoration: 'line-through', marginRight: '30px' }}>{oldPrice}</span>}
                    {price}
                </Card.Text>
                <Button variant="dark" onClick={() => addCarrito(id)}>AGREGAR AL CARRITO</Button>
            </Card.Body>
        </Card>
    )
}