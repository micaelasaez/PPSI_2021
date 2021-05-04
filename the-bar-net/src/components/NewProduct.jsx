import React, { useCallback, useEffect, useState } from 'react';
import './styles.css';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import InputGroup from 'react-bootstrap/InputGroup';

const fields = [
    { id: "name", label: "Nombre de la bebida", placeholder: "Ingrese nombre", type: "text" },
    { id: "quantity", label: "Cantidad en mm", placeholder: "Ingrese cantidad", type: "number" },
    { id: "price", label: "Precio en $", placeholder: "Ingrese precio", type: "number" },
    { id: "stock", label: "Stock actual", placeholder: "Ingrese stock", type: "number" },
    { id: "min_stock", label: "Stock mínimo disponible", placeholder: "Ingrese stock", type: "number" },
    { id: "max_stock", label: "Stock máximo disponible", placeholder: "Ingrese stock", type: "number" },
    { id: "photo", label: "Foto de la bebida", type: "file" },
];

export default function NewProduct() {
    const [name, setName] = useState("");
    const [quantity, setQuantity] = useState(0);
    const [price, setPrice] = useState(0);
    const [stock, setStock] = useState(null);
    const [minStock, setMinStock] = useState(null);
    const [maxStock, setMaxStock] = useState(null);
    const [photo, setPhoto] = useState(null);
    const [submitDisabled, setSubmitDisabled] = useState(true);

    const handleSubmit = useCallback(() => {
        console.log("submit", name, quantity, price, stock, minStock, maxStock, photo)
    }, [name, quantity, price, stock, minStock, maxStock, photo]);

    const handleChange = useCallback((value) => {
        console.log(value.target.id, value)
        if (value.target.id === "photo") {
            setPhoto(value.target.files[0])
        }
        switch (value.target.id) {
            case "name":
                setName(value.target.value);
                break;
            case "quantity":
                setQuantity(value.target.value);
                break;
            case "price":
                setPrice(value.target.value);
                break;
            case "stock":
                setStock(value.target.value);
                break;
            case "min_stock":
                setMinStock(value.target.value);
                break;
            case "max_stock":
                setMaxStock(value.target.value);
                break;
            default:
                break;
        }
    }, []);

    useEffect(() => {
        if (name !== "" && quantity !== 0 && price !== 0 && stock !== null && minStock !== null && maxStock !== null && photo !== null) {
            setSubmitDisabled(false);
        }
    }, [name, quantity, price, stock, minStock, maxStock, photo, setSubmitDisabled])

    return (
        <>
            <div style={{ height: "100%", width: "60%", margin: "auto" }}>
                <br />
                <h1 style={{ marginBottom: "30px" }}>Agregar Bebida</h1>
                <Form>
                    {
                        fields.map(item => {
                            return item.type === "file"
                                ? <Form.Group key={item.id}>
                                    <Form.File id={item.id} label={item.label} onChange={handleChange} />
                                </Form.Group>
                                : <Form.Group key={item.id} >
                                    <Form.Label>{item.label}</Form.Label>
                                    <InputGroup>
                                        {item.id === "price" && (
                                            <InputGroup.Prepend>
                                                <InputGroup.Text>$</InputGroup.Text>
                                            </InputGroup.Prepend>
                                        )}
                                        <Form.Control type={item.type} id={item.id} placeholder={item.placeholder} onChange={handleChange} />
                                    </InputGroup>
                                </Form.Group>
                        })
                    }
                    <Button onClick={handleSubmit} disabled={submitDisabled} className="personalized-button">
                        Guardar
                </Button>
                </Form>
                <br /><br /><br />
            </div>
        </>
    )
}