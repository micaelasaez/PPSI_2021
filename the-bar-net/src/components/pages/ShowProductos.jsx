import React, { useContext, useEffect, useState } from 'react';
import { useLocation } from 'react-router';
import '../styles.css';
import Product from '../Product';
import { TheBarNetServerUrl } from '../context/Url';
import { TheNetBar } from '../context/TheNetBarContext';

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
    const { addCarrito } = useContext(TheNetBar.Context);
    const { state } = useLocation();
    const { categoryId, title } = state;
    const [products, setProducts] = useState([]);

    const addCarritoLocal = (p, cantidad) => {
        // console.log(p.precio, cantidad);
        addCarrito(p, cantidad);
    }

    useEffect(() => {
        fetch(TheBarNetServerUrl.products + '/category/' + categoryId, {
            mode: 'cors'
        }).then(res => res.json())
        .then(response => {
            console.log(response);
            setProducts(response.rta)
        })
    }, [categoryId]);
    
    /* ejemplo producto
    StockMax: 53
    cantidad: " 473 ml"
    fechaVencimiento: ""
    fotos: "https://statics.dinoonline.com.ar/imagenes/full_600x600_ma/3100659_f.jpg"
    nombre: "Pack Cerveza Patagonia Weisse"
    precio: 700
    stockActual: 42
    stockMin: 30*/

    return (
        <div>
            <h1 className="tittle-style" style={styles.title}>{title}</h1>
            <div style={styles.product}>
                {products.length > 0 
                    ? products.map(p => (
                        p.stockActual > 0 && <Product addCarrito={addCarritoLocal} p={p}/>
                    ))
                    : <p>
                        <h3>Disculpe, no hay productos de esa categoría actualmente!</h3>
                        <br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br />
                    </p>
                }
                <br /><br /><br /><br /><br /><br /><br /><br />
            </div>
        </div>
    )
}