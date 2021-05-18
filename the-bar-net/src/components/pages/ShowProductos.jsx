import React, { useEffect } from 'react';
import { useLocation } from 'react-router';
import '../styles.css';
import Product from '../Product';
import { TheBarNetServerUrl } from '../context/Url';

const styles = {
    product: {
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
        alignItems: 'stretch'
    },
    title: {
        marginTop: '25px'
    }
}

export default function ShowProductos() {
    const { state } = useLocation();
    const { title, name } = state;

    const getProducts = async () => {
        const response = await fetch(TheBarNetServerUrl.products + '/' + name, {
            mode: 'no-cors'
        });
        console.log(response);
    }

    const addCarrito = id => {
        console.log(id)
    }

    useEffect(() => {
        getProducts()
    }, []);

    return (
        <>
            <h1 style={styles.title}>{title}</h1>
            <div style={styles.product}>
                <Product title="Name" price='$800' addCarrito={addCarrito} id='1'/>
                <Product title="Name" price='$800' oldPrice='$900' addCarrito={addCarrito} id='1'/>
                <Product title="Name" price='$800' addCarrito={addCarrito} id='1'/>
                <Product title="Name" price='$752' addCarrito={addCarrito} id='1'/>
            </div>
        </>
    )
}