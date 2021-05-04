import React from 'react';
import { useLocation } from 'react-router';
import '../styles.css';
import Product from '../Product';

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

    return (
        <>
            <h1 style={styles.title}>{title}</h1>
            <div style={styles.product}>
                <Product />
                <Product />
                <Product />
                <Product />
            </div>
        </>
    )
}