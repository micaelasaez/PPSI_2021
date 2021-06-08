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
    const { title, name } = state;
    const [products, setProducts] = useState([]);

    const addCarritoLocal = (p, cantidad) => {
        // console.log(p.precio, cantidad);
        addCarrito(p, cantidad);
    }

    useEffect(() => {
        fetch(TheBarNetServerUrl.products + '/category/' + name, {
            mode: 'cors'
        }).then(res => res.json())
        .then(response => {
            console.log(response);
            setProducts(response.rta)
        })
    }, [name]);
    
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
        <>
            <h1 className="tittle-style" style={styles.title}>{title}</h1>
            <div style={styles.product}>
                {
                    products.map(p => (
                        p.stockActual > 0 && <Product addCarrito={addCarritoLocal} p={p}/>
                        //oldPrice
                    ))
                }
                {/* <Product title="Name" price='$800' oldPrice={undefined} addCarrito={()=> addCarrito({title: 'Name', price: '300'})} id='1'/>
                <Product title="Name" price='$800' oldPrice='$900' addCarrito={()=> addCarrito({title: 'Name', price: '300'})} id='2'/>
                <Product title="Name" price='$800' addCarrito={()=> addCarrito({title: 'Name', price: '300'})} id='3'/>
                <Product title="Name" price='$752' addCarrito={()=> addCarrito({title: 'Name', price: '300'})} id='4'/> */}
            </div>
        </>
    )
}