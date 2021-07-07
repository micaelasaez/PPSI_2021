import React, { useCallback, useEffect, useState } from 'react';
import '../styles.css';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import InputGroup from 'react-bootstrap/InputGroup';
import { TheBarNetServerUrl } from '../context/Url';

const categories = [
    { name: 'cervezas', title: 'Cervezas' },
    { name: 'vinos', title: 'Vinos' },
    { name: 'espumantes', title: 'Espumantes' },
    { name: 'vodka', title: 'Vodkas' },
    { name: 'whiskys', title: 'Whiskys' },
    { name: 'sin-alcohol', title: 'Sin Alcohol' }
];
const quantityTypes = [
    { key: "ml", type: "ml" },
    { key: "l", type: "l" },
    { key: "six-pack", type: "Six Pack" },
    { key: "12u", type: "Caja 12 unidades" },
    { key: "24u", type: "Caja 24 unidades" }
];

export default function AddProduct() {
    const todayDate = new Date().toJSON().slice(0, 10).replace(/-/g, '-');
    const [name, setName] = useState("");
    const [category, setCategory] = useState("");
    const [quantity, setQuantity] = useState(0);
    const [quantityType, setQuantityType] = useState("");
    const [price, setPrice] = useState(0);
    const [stock, setStock] = useState(0);
    const [minStock, setMinStock] = useState(0);
    const [maxStock, setMaxStock] = useState(0);
    const [fechaVencimiento, setFechaVencimiento] = useState(todayDate);
    const [photo, setPhoto] = useState(null);
    const [photoLocalURL, setPhotoLocalURL] = useState(null);
    const [submitDisabled, setSubmitDisabled] = useState(true);
    const [showAlert, setShowAlert] = useState(false);
    const [alertMsg, setAlertMsg] = useState('');

    const handleSubmit = useCallback(() => {
        const product = {
            nombre: name,
            categoria: category,
            precio: price,
            cantidad: quantity + " " + quantityType,
            stockActual: stock,
            stockMin: minStock,
            stockMax: maxStock,
            // foto: photo,
            fechaVencimiento: ''
        };
        console.log(product);
        fetch(TheBarNetServerUrl.products, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            mode: 'cors', // no-cors
            body: JSON.stringify(product)
        })
            .then(res => res.json())
            .catch(error => console.error('Error:', error))
            .then(response => {
                console.log('response 1', response);
                const formData = new FormData();
                formData.append('photo', photo);
                fetch(TheBarNetServerUrl.productPhoto + response.idProducto, {
                    method: 'POST',
                    mode: 'cors', // no-cors
                    body: formData
                })
                    .then(res => res.json())
                    .then(response => {
                        console.log('response 2', response);
                        setAlertMsg('Producto creado correctamente!');
                        setShowAlert(true);
                    });
            })
            .catch(() => {
                setAlertMsg('Algo falló con la creación del producto!');
                setShowAlert(true);
            });
    }, [name, category, price, quantity, quantityType, stock, minStock, maxStock, photo]);

    const handleChange = useCallback((value) => {
        if (value.target.id === "photo") {
            setPhoto(value.target.files[0])
            return setPhotoLocalURL(URL.createObjectURL(value.target.files[0]))
        }
        switch (value.target.id) {
            case "name":
                setName(value.target.value);
                break;
            case "category":
                setCategory((categories.find(c => c.title === value.target.value)).name);
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
            case "date":
                setFechaVencimiento(value.target.value);
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
    const maxStockValid = maxStock > -1 && maxStock > minStock;
    const photoValid = photo !== null;
    const fechaValid = (fechaVencimiento === todayDate || fechaVencimiento === '');

    const fields = [
        { id: "name", label: "Nombre de la bebida", placeholder: "Ingrese nombre", type: "text", isValid: nameValid },
        { id: "category", label: "Seleccione categoría", placeholder: "", type: "select" },
        { id: "quantity", label: "Cantidad", placeholder: "Ingrese cantidad", type: "number", isValid: quantityValid },
        { id: "price", label: "Precio en $", placeholder: "Ingrese precio", type: "number", isValid: priceValid },
        { id: "stock", label: "Stock actual", placeholder: "0", type: "number", isValid: stockValid },
        { id: "min_stock", label: "Stock mínimo disponible", placeholder: "0", type: "number", isValid: minStockValid },
        { id: "max_stock", label: "Stock máximo disponible", placeholder: "0", type: "number", isValid: maxStockValid },
        { id: "fechaVencimiento", label: "Fecha de Vencimiento", type: "date", isValid: maxStockValid },
        { id: "photo", label: "Foto de la bebida", type: "file" },
    ];

    useEffect(() => {
        if (nameValid && quantityValid && priceValid && stockValid && minStockValid && maxStockValid && photoValid
            && category !== "" && quantityType !== "" && !fechaValid) {
            setSubmitDisabled(false);
        } else {
            setSubmitDisabled(true);
        }
    }, [setSubmitDisabled, nameValid, quantityValid, priceValid, stockValid, minStockValid, maxStockValid, photoValid, category, quantityType, fechaValid])

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
                                    <div style={{ display: 'flex', margin: 'auto', justifyContent: "space-around" }}>
                                        <input type="file" id="photo" onChange={handleChange} accept="image/*" name="photo" />
                                        {photoLocalURL !== null && <div>
                                            <img src={photoLocalURL} alt="" style={{ height: "120px", width: "120px", marginTop: "5px" }} />
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
                                                : item.id === "fechaVencimiento"
                                                    ? <>
                                                        <input type="date" id="date" name="date" value={fechaVencimiento} min={todayDate} onChange={handleChange} />
                                                        {fechaValid && <div className="text-muted-personalized">
                                                            Ingrese la fecha de vencimiento.
                                                        </div>}
                                                    </>
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
                <Modal show={showAlert} onHide={() => setShowAlert(false)}>
                    <Modal.Header closeButton>
                        <Modal.Title>Aviso</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <p>{alertMsg}</p>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="primary" onClick={() => setShowAlert(false)}>
                            Aceptar
                        </Button>
                    </Modal.Footer>
                </Modal>
            </div>
        </>
    )
}