import React, { useCallback, useEffect, useState } from 'react';
import '../styles.css';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import InputGroup from 'react-bootstrap/InputGroup';

const categories = [
    { name: 'cervezas', title: 'Cervezas' },
    { name: 'vinos', title: 'Vinos' },
    { name: 'espumantes', title: 'Espumantes' },
    { name: 'vodka', title: 'Vodkas' },
    { name: 'whiskys', title: 'Whiskys' },
    { name: 'sin-alcohol', title: 'Sin Alcohol' }
];
const quantityTypes = [
    { key: "ml", type: "Mili Litros" },
    { key: "l", type: "Litro" },
    { key: "six-pack", type: "Six Pack" },
    { key: "12u", type: "Caja 12 unidades" },
    { key: "24u", type: "Caja 24 unidades" }
];

export default function AddProduct() {
    const [name, setName] = useState("");
    const [category, setCategory] = useState("");
    const [quantity, setQuantity] = useState(0);
    const [quantityType, setQuantityType] = useState("");
    const [price, setPrice] = useState(0);
    const [stock, setStock] = useState(0);
    const [minStock, setMinStock] = useState(0);
    const [maxStock, setMaxStock] = useState(0);
    const [photo, setPhoto] = useState(null);
    const [submitDisabled, setSubmitDisabled] = useState(true);

    const handleSubmit = useCallback(() => {
        const product = {
            nombre: name,
            categoria: category,
            precio: price,
            cantidad: quantity + " " + quantityType,
            stock: stock,
            minStock: minStock,
            maxStock: maxStock,
            foto: photo
        };
        console.log(product)
    }, [name, category, price, quantity, quantityType, stock, minStock, maxStock, photo]);

    const handleChange = useCallback((value) => {
        if (value.target.id === "photo") {
            return setPhoto(URL.createObjectURL(value.target.files[0]))
        }
        switch (value.target.id) {
            case "name":
                setName(value.target.value);
                break;
            case "category":
                setCategory(value.target.value);
                break;
            case "quantity":
                setQuantity(value.target.value);
                break;
            case "quantity-type":
                setQuantityType(value.target.value);
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

    const nameValid = name !== "";
    const quantityValid = quantity !== 0;
    const priceValid = price !== 0;
    const stockValid = stock > -1;
    const minStockValid = minStock > -1;
    const maxStockValid = maxStock > -1;
    const photoValid = photo !== null;
    const fields = [
        { id: "name", label: "Nombre de la bebida", placeholder: "Ingrese nombre", type: "text", isValid: nameValid },
        { id: "category", label: "Seleccione categoría", placeholder: "", type: "select" },
        { id: "quantity", label: "Cantidad", placeholder: "Ingrese cantidad", type: "number", isValid: quantityValid },
        { id: "price", label: "Precio en $", placeholder: "Ingrese precio", type: "number", isValid: priceValid },
        { id: "stock", label: "Stock actual", placeholder: "0", type: "number", isValid: stockValid },
        { id: "min_stock", label: "Stock mínimo disponible", placeholder: "0", type: "number", isValid: minStockValid },
        { id: "max_stock", label: "Stock máximo disponible", placeholder: "0", type: "number", isValid: maxStockValid },
        { id: "photo", label: "Foto de la bebida", type: "file" },
    ];

    useEffect(() => {
        if (nameValid && quantityValid && priceValid && stockValid && minStockValid && maxStockValid && photoValid
            && category !== "" && quantityType !== "") {
            setSubmitDisabled(false);
        } else {
            setSubmitDisabled(true);
        }
    }, [setSubmitDisabled, nameValid, quantityValid, priceValid, stockValid, minStockValid, maxStockValid, photoValid, category, quantityType])

    return (
        <>
            <div style={{ height: "100%", width: "60%", margin: "auto" }}>
                <br />
                <h1 className="tittle-style" style={{ marginBottom: "30px", fontSize: "35px", marginTop: "40px" }}>AGREGAR BEBIDA</h1>
                <Form>
                    {
                        fields.map(item => (
                            item.type === "file"
                                ? <Form.Group key={item.id}>
                                    {/* <Form.File id={item.id} label={item.label} onChange={handleChange} /> */}
                                    <div style={{ display: 'flex', margin: 'auto', justifyContent: "space-around" }}>
                                        <input type="file" id={item.id} onChange={handleChange} />
                                        {photo !== null && <div>
                                            <img src={photo} alt="" style={{ height: "120px", width: "120px", marginTop: "5px" }} />
                                        </div>}
                                    </div>
                                </Form.Group>
                                : <Form.Group key={item.id}>
                                    <div style={{ display: 'flex' }}>
                                        <Form.Label style={{ width: '40%' }}>{item.label}</Form.Label>
                                        <InputGroup>
                                            {item.id === "price" && (
                                                <InputGroup.Prepend>
                                                    <InputGroup.Text>$</InputGroup.Text>
                                                </InputGroup.Prepend>
                                            )}
                                            {item.id === "category"
                                                ? <Form.Control as="select" onChange={handleChange} id={item.id}>
                                                    <option key='default'></option>
                                                    {categories.map(c => (
                                                        <option key={c.name}>{c.title}</option>
                                                    ))}
                                                </Form.Control>
                                                : <Form.Control type={item.type} id={item.id} placeholder={item.placeholder} onChange={handleChange} isValid={item.isValid} />
                                            }
                                            {item.id === "quantity" && (
                                                <Form.Control as="select" onChange={handleChange} id="quantity-type">
                                                    <option key='default'></option>
                                                    {quantityTypes.map(t => (
                                                        <option key={t.key}>{t.type}</option>
                                                    ))}
                                                </Form.Control>
                                            )}
                                        </InputGroup>
                                    </div>
                                </Form.Group>
                        ))
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