import React, { useCallback, useState } from 'react';
import './styles.css';
import Form from 'react-bootstrap/Form';
import Card from 'react-bootstrap/Card';
import { useEffect } from 'react';

export const TarjetasInput = ({ handleValidData }) => {
    const todayDate = new Date().toJSON().slice(0, 10).replace(/-/g, '-');
    const [number, setNumber] = useState('');
    const [code, setCode] = useState('');
    const [date, setDate] = useState(todayDate);


    const handleChange = useCallback((value) => {
        if (value.target.name === "number") {
            let num = value.target.value;
            // if (number.length === 3 || number.length === 7 || number.length === 11) {
            //     num += ' ';
            // }
            setNumber(num);
        } else if (value.target.name === "code") {
            setCode(value.target.value);
        } else if (value.target.name === "date") {
            setDate(value.target.value);
        }
    }, []);

    useEffect(() => {
        const dateValid = date !== todayDate && date !== '';
        const numberValid = number.length === 16;
        const codeValid = code.length === 3;

        if (dateValid && numberValid && codeValid) {
            handleValidData();
        }
    }, [code, code.length, date, handleValidData, number, number.length, todayDate]);

    return (
        <Card style={{ width: '40%', height: "fit-content", margin: 'auto', marginBottom: '30px', backgroundColor: '#8f61b5' }}>
            <Card.Body>
                <Form className="tarjeta-form">
                    <Form.Group controlId="formBasicNumber">
                        <Form.Label className="login-form-tittles">Número de la tarjeta</Form.Label>
                        <Form.Control
                            type="number"
                            name="number"
                            placeholder="**** **** **** ****"
                            isValid={number.length === 16}
                            onChange={handleChange}
                        />
                        {(number.length > 1 && number.length !== 16) && <Form.Text className="text-muted-personalized">
                            Ingrese un número de tarjeta válido.
                        </Form.Text>}
                    </Form.Group>

                    <Form.Group controlId="formBasicCode">
                        <Form.Label className="login-form-tittles">Fecha de Vencimiento</Form.Label>
                        <input type="date" id="date" name="date" value={date} min={todayDate} onChange={handleChange} />
                        {(date === todayDate || date === '') && <Form.Text className="text-muted-personalized">
                            Ingrese la fecha de vencimiento.
                        </Form.Text>}
                    </Form.Group>

                    <Form.Group controlId="formBasicCode">
                        <Form.Label className="login-form-tittles">Código de seguridad</Form.Label>
                        <Form.Control
                            type="number"
                            name="code"
                            placeholder="***"
                            isValid={code.length === 3}
                            onChange={handleChange}
                        />
                        {(code.length !== 3 && code.length > 0) && <Form.Text className="text-muted-personalized">
                            Ingrese un código de seguridad válido.
                        </Form.Text>}
                    </Form.Group>

                    <Form.Text className="text-muted-personalized">
                        {/* {tryAgainText} */}
                    </Form.Text>
                </Form>
            </Card.Body>
        </Card>
    )
}