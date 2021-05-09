import React, { useCallback, useEffect, useState } from 'react';
import '../styles.css';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Nav from 'react-bootstrap/Nav';
import { TheNetBarContextConsumer } from '../context/TheNetBarContext';
import { useHistory } from 'react-router';

const validateEmail = (mail) => {
    if (/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(mail)) {
        return true;
    }
    return false;
}

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [mailError, setMailError] = useState(false);
    const [tryAgainText, setTryAgainText] = useState(false);
    const [submitDisabled, setSubmitDisabled] = useState(true);
    const history = useHistory();

    const handleSubmit = (setIsLogged) => {
        if (!submitDisabled) {
            console.log("logged in", email, password, setIsLogged)
            setIsLogged(true);
            history.push("/home");
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
        const validMail = validateEmail(email);
        setMailError(validMail);

        if (validMail && validPass) {
            setSubmitDisabled(false);
        } else {
            setSubmitDisabled(true);
        }
    }, [email, password, setSubmitDisabled])

    return (
        <div style={{ height: "100%" }}>
            <h1 className="login-form-tittle">Iniciar Sesión</h1>
            <Form className="login-form">
                <br />
                <br />
                <Form.Group controlId="formBasicEmail">
                    <Form.Label className="login-form-tittles">Email</Form.Label>
                    <Form.Control
                        type="email"
                        name="email"
                        placeholder="name@example.com"
                        isValid={mailError}
                        onChange={handleChange}
                    />
                    {(!mailError && email.length > 1) && <Form.Text className="text-muted-personalized">
                        Ingrese un mail válido.
                    </Form.Text>}
                </Form.Group>

                <Form.Group controlId="formBasicPassword">
                    <Form.Label className="login-form-tittles">Contraseña</Form.Label>
                    <Form.Control type="password" name="password" placeholder="Password" onChange={handleChange} />
                </Form.Group>

                <Form.Text className="text-muted-personalized">
                    {/* Datos incorrectos, por favor verifique! */}
                    {tryAgainText}
                </Form.Text>
                <br />
                <br />
                <TheNetBarContextConsumer>
                    {
                        ({ setIsLogged }) => (
                            <Button onClick={() => handleSubmit(setIsLogged)} disabled={submitDisabled} className="personalized-button">
                                Ingresar
                            </Button>
                        )}
                </TheNetBarContextConsumer>
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
            {/* <p>Falta crear cuenta + validar email si es que vamos a usar mail</p> */}
        </div>
    )
}