import React, { useCallback, useEffect, useState } from 'react';
import '../styles.css';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
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
    { key: "ml", type: "Mili Litros" },
    { key: "l", type: "Litro" },
    { key: "six-pack", type: "Six Pack" },
    { key: "12u", type: "Caja 12 unidades" },
    { key: "24u", type: "Caja 24 unidades" }
];

export default function AddCatergory() {
    const [name, setName] = useState("");
    const [photo, setPhoto] = useState(null);
    const [submitDisabled, setSubmitDisabled] = useState(true);

    const handleSubmit = useCallback(() => {
        const category = {
            nombre: name,
            foto: photo
        };
        console.log(category);
        // fetch(TheBarNetServerUrl.category, {
        //     method: 'POST',
        //     headers: {
        //         'Content-Type': 'application/json'
        //     },
        //     mode: 'cors', // no-cors
        //     body: JSON.stringify(category)
        // })
        //     .then(res => res.json())
        //     .catch(error => console.error('Error:', error))
        //     .then(response => {
        //         console.log(response);
        //         // if todo ok 
        //         // alert('creado')
        //         // else
        //         // alert('algo fallo', response.mensaje)
        //     });
    }, [name, photo]);

    const handleChange = useCallback((value) => {
        if (value.target.id === "photo") {
            return setPhoto(URL.createObjectURL(value.target.files[0]))
        }
        switch (value.target.id) {
            case "name":
                setName(value.target.value);
                break;
            default:
                break;
        }
    }, []);

    const nameValid = name !== "";
    const photoValid = photo !== null;

    useEffect(() => {
        if (nameValid && photoValid) {
            setSubmitDisabled(false);
        } else {
            setSubmitDisabled(true);
        }
    }, [setSubmitDisabled, nameValid, photoValid])

    return (
        <>
            <div style={{ height: "100%", width: "60%", margin: "auto" }}>
                <br />
                <h1 className="tittle-style" style={{ marginBottom: "30px", fontSize: "35px", marginTop: "40px" }}>AGREGAR CATEGORIA</h1>
                <Form>
                    <Form.Group key={'photo'}>
                        {/* <Form.File id={item.id} label={item.label} onChange={handleChange} /> */}
                        <div style={{ display: 'flex', margin: 'auto', justifyContent: "space-around" }}>
                            <input type="file" id={'photo'} onChange={handleChange} />
                            {photo !== null && <div>
                                <img src={photo} alt="" style={{ height: "120px", width: "120px", marginTop: "5px" }} />
                            </div>}
                        </div>
                    </Form.Group>
                    <Form.Group key={'name'}>
                        <Form.Label style={{ width: '40%' }}>Nombre de la Categoría</Form.Label>
                        <InputGroup>
                            <Form.Control type='text' id='name' placeholder="Ingrese Nombre" onChange={handleChange} isValid={name.length > 0} />
                        </InputGroup>
                    </Form.Group>
                    <Button onClick={handleSubmit} disabled={submitDisabled} className="personalized-button">
                        Guardar
                    </Button>
                </Form>
                <br /><br /><br />
            </div>
        </>
    )
}