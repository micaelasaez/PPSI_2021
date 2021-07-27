import React, { useCallback, useState } from 'react';
import './styles.css';
import Form from 'react-bootstrap/Form';
import Card from 'react-bootstrap/Card';
import { useEffect } from 'react';
import { TheBarNetServerUrl } from './context/Url';

export const TarjetasInput = ({ handleValidData, modalidadPagoSeleccionada }) => {
    const todayDate = new Date().toJSON().slice(0, 10).replace(/-/g, '-');
    const [number, setNumber] = useState('');
    const [code, setCode] = useState('');
    const [date, setDate] = useState(todayDate);
    const [tarjetas, setTarjetas] = useState([]);
    const [promos, setPromos] = useState([]);
    const [tryAgainText, setTryAgainText] = useState('');

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
        const dateValid = tarjetas.find(t => t.fechaVencimiento === date);
        const numberValid = tarjetas.find(t => t.numero === number);
        const codeValid = tarjetas.find(t => Number.parseInt(code) === t.codSeguridad);
        const typeValid = tarjetas.find(t => modalidadPagoSeleccionada === t.tipo);
        // const dateValid = date !== todayDate && date !== '';
        // const numberValid = number.length === 16;
        // const codeValid = code.length === 3;

        if (dateValid !== undefined && numberValid !== undefined && codeValid !== undefined && typeValid !== undefined) {
            const tarjetaSeleccionada = tarjetas.find(t => t.numero === number && t.codSeguridad === Number.parseInt(code));
            // console.log(tarjetaSeleccionada, number, code, hasPromo)
            let hasPromo = undefined;
            if (tarjetaSeleccionada) {
                hasPromo = promos.find(p => p.idBanco === tarjetaSeleccionada.idBanco);
            }

            if (hasPromo !== undefined) {
                handleValidData(hasPromo.descuento);
                setTryAgainText('Esta tarjeta tiene un descuento del ' + hasPromo.descuento);
            }
        } else {
            // setTryAgainText('Esa tarjeta no se encuentra registrada en nuestros sistemas.');

            if (date !== todayDate && date !== '' && number.length === 16 && code.length === 3) {
                handleValidData('');
                setTryAgainText('Esa tarjeta no tiene descuento :(');
            }
        }
    }, [code, date, handleValidData, modalidadPagoSeleccionada, number, promos, tarjetas, todayDate]);

    useEffect(() => {
        fetch(TheBarNetServerUrl.tarjetas, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
            mode: 'cors', // no-cors
        })
            .then(res => res.json())
            .then(response => {
                console.log(response.rta);
                setTarjetas(response.rta);
                /*  TARJETA
                    codSeguridad: 111
                    estaActiva: "yes"
                    fechaVencimiento: "2022-12-31"
                    id: 1
                    idBanco: 1
                    nombre: "tarjeta ICBC"
                    numero: "1234123412341234"
                    tipo: "credito"
                */
                fetch(TheBarNetServerUrl.promoBancos, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    mode: 'cors', // no-cors
                })
                    .then(res => res.json())
                    .then(response => {
                        console.log(response.rta);
                        const vigentes = (response.rta.filter(element => {
                            let fin = (new Date(element.fechaFin))
                            let inicio = (new Date(element.fechaInicio))
                            let hoy = (new Date(todayDate))
                            return (inicio <= hoy) && (hoy <= fin);
                        }));
                        setPromos(vigentes);
                    });
            });
    }, [todayDate]);

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
                        {tryAgainText}
                    </Form.Text>
                </Form>
            </Card.Body>
        </Card>
    )
}