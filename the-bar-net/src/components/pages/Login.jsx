import React, { useCallback, useEffect, useState } from 'react';
import '../styles.css';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { TheNetBarContextConsumer } from '../context/TheNetBarContext';
import { useHistory } from 'react-router';

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
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
        if (email !== "" && password !== "") {
            setSubmitDisabled(false);
        } else {
            setSubmitDisabled(true);
        }
    }, [email, password, setSubmitDisabled])

    return (
        <div style={{ height: "100%" }}>
            <h1 style={{ marginTop: "50px" }}>Login</h1>
            <Form className="login-form">
                <Form.Group controlId="formBasicEmail">
                    <Form.Label>Email</Form.Label>
                    <Form.Control type="email" name="email" placeholder="Enter email" onChange={handleChange} />
                    {/* <Form.Text className="text-muted">
                        some text
                    </Form.Text> */}
                </Form.Group>

                <Form.Group controlId="formBasicPassword">
                    <Form.Label>Contraseña</Form.Label>
                    <Form.Control type="password" name="password" placeholder="Password" onChange={handleChange} />
                </Form.Group>
                <TheNetBarContextConsumer>
                    {
                        ({ setIsLogged }) => (
                            <Button onClick={() => handleSubmit(setIsLogged)} disabled={submitDisabled} className="personalized-button">
                                Ingresar
                            </Button>
                        )}
                </TheNetBarContextConsumer>
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