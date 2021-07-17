import React, { useCallback, useContext, useEffect, useState } from 'react';
import '../styles.css';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner';
import Nav from 'react-bootstrap/Nav';
import { TheNetBar } from '../context/TheNetBarContext';
import { useHistory } from 'react-router';
import { TheBarNetServerUrl } from '../context/Url';
import { useLocation } from 'react-router-dom';

const validateEmail = (mail) => {
    if (/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(mail)) {
        return true;
    }
    return false;
}

export default function Login() {
    const { setIsLogged } = useContext(TheNetBar.Context);
    const history = useHistory();
    const { state } = useLocation();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loginLoading, setLoginLoading] = useState(false);
    const [mailError, setMailError] = useState(false);
    const [tryAgainText, setTryAgainText] = useState(false);
    const [submitDisabled, setSubmitDisabled] = useState(true);

    const handleSubmit = async () => {
        if (!submitDisabled) {
            setLoginLoading(true);
            fetch(TheBarNetServerUrl.login, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                mode: 'cors', // no-cors
                body: JSON.stringify({
                    email: (state || email),
                    password: password
                })
            })
                .then(res => res.json())
                .catch(error => console.error('Error:', error))
                .then(response => {
                    const token = response.rta;
                    if (token === "Incorrect login") {
                        setTryAgainText("Email o contraseña incorrectos!");
                    } 
                    else if (token === "usuario no confiable") {
                        setTryAgainText("Su usuario se encuentra bloqueado en el sistema!")
                    }
                    else {
                        fetch(TheBarNetServerUrl.verifyToken, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            mode: 'cors', // no-cors
                            body: JSON.stringify({
                                token: token
                            })
                        }).then(res => res.json())
                            .then(response => {
                                const userProfile = response.rta;
                                setIsLogged(true, token, userProfile);
                                let route = '';
                                switch (userProfile.tipo) {
                                    case 'admin':
                                        route = "/home-admin";
                                        break;
                                    case 'encargado':
                                        route = "/home-encargado";
                                        break;
                                    case 'empleado':
                                        route = "/home-empleado";
                                        break;
                                    case 'repartidor':
                                        route = "/home-repartidor";
                                        break;
                                    case 'cliente':
                                        route = "/home";
                                        break;

                                    default:
                                        route = "/home";
                                        break;
                                }
                                history.push(route);
                            });
                    }
                    setLoginLoading(false);
                });
        }
    }

    const handleChange = useCallback((value) => {
        if (value.target.name === "email") {
            setEmail(value.target.value);
        } else {
            setPassword(value.target.value);
        }
    }, [setEmail, setPassword]);

    useEffect(() => {
        const validPass = password.length > 4;
        const validMail = validateEmail(state || email);
        setMailError(validMail);

        if (validMail && validPass) {
            setSubmitDisabled(false);
        } else {
            setSubmitDisabled(true);
        }
    }, [email, password, setSubmitDisabled, state]);

    return (
        <div style={{ height: "100%" }}>
            <h1 className="login-form-tittle">Iniciar Sesión</h1>
            <Form className="login-form">
                <br />
                <br />
                {console.log(state)}
                <Form.Group controlId="formBasicEmail">
                    <Form.Label className="login-form-tittles">Email</Form.Label>
                    <Form.Control
                        type="email"
                        name="email"
                        placeholder="name@example.com"
                        isValid={mailError}
                        onChange={handleChange}
                        defaultValue={state || ""}
                    />
                    {(!mailError && email.length > 1) && <Form.Text className="text-muted-personalized">
                        Ingrese un mail válido.
                    </Form.Text>}
                </Form.Group>

                <Form.Group controlId="formBasicPassword">
                    <Form.Label className="login-form-tittles">Contraseña</Form.Label>
                    <Form.Control type="password" name="password" placeholder="Password" onChange={handleChange} isValid={password.length > 4} />
                </Form.Group>

                <Form.Text className="text-muted-personalized">
                    {/* Datos incorrectos, por favor verifique! */}
                    {tryAgainText}
                </Form.Text>
                <br />
                <br />
                {loginLoading
                    ? <Spinner animation="border" variant="primary" />
                    : <Button onClick={handleSubmit} disabled={submitDisabled} className="personalized-button">
                        Ingresar
                    </Button>
                }
                <br />
                <br />
                <Nav.Link href="/sign-up" className={"sign-up"}>
                    No tenés cuenta? Registrate acá
                </Nav.Link>
            </Form>
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
        </div>
    )
}