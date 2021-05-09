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

export default function SignUp() {
    const [name, setName] = useState("");
    const [surname, setSurname] = useState("");
    const [dni, setDni] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [passwordRepeat, setPasswordRepeat] = useState("");
    const [mailError, setMailError] = useState(false);
    const [passwordError, setPasswordError] = useState("");
    const [passwordDiferent, setPasswordDifferent] = useState("");
    const [tryAgainText, setTryAgainText] = useState("");
    const [submitDisabled, setSubmitDisabled] = useState(true);
    const history = useHistory();

    const handleSubmit = (setIsLogged) => {
        if (!submitDisabled) {
            console.log("logged in");
            setIsLogged(true);
            history.push("/home");
        }
    }

    const handleChange = useCallback((value) => {
        if (value.target.name === "name") {
            setName(value.target.value);
        } else if (value.target.name === "surname") {
            setSurname(value.target.value);
        } else if (value.target.name === "email") {
            setEmail(value.target.value);
        } else if (value.target.name === "password") {
            setPassword(value.target.value);
        } else if (value.target.name === "password-repeat") {
            setPasswordRepeat(value.target.value);
        } else if (value.target.name === "dni") {
            setDni(value.target.value);
        }
    }, [setEmail, setPassword]);

    useEffect(() => {
        const validName = name.length > 1;
        const validSurname = surname.length > 1;
        const validDNI = dni.length > 1;
        const validPass = password.length > 4;
        setPasswordError(!validPass);
        const validPassRepeat = password === passwordRepeat;
        setPasswordDifferent(validPassRepeat);
        const validMail = validateEmail(email);
        setMailError(validMail);

        if (validMail && validPass && validName && validSurname && validDNI && validPassRepeat) {
            setSubmitDisabled(false);
        } else {
            setSubmitDisabled(true);
        }
    }, [dni.length, email, name.length, password, passwordRepeat, setSubmitDisabled, surname.length]);


    return (
        <div style={{ height: "100%" }}>
            <h1 className="login-form-tittle">Registro de Cuenta</h1>
            <Form className="login-form">
                <br />
                <br />
                <Form.Group controlId="formBasicEmail" className="inline-name-surname">
                    <Form.Label className="login-form-tittles">Nombre</Form.Label>
                    <Form.Control type="text" name="name" placeholder="" onChange={handleChange} />
                </Form.Group>
                <Form.Group>
                    <Form.Label className="login-form-tittles">Apellido</Form.Label>
                    <Form.Control type="text" name="surname" placeholder="" onChange={handleChange} />
                </Form.Group>
                <Form.Group>
                    <Form.Label className="login-form-tittles">DNI (sin puntos ni comas)</Form.Label>
                    <Form.Control type="number" name="dni" placeholder="" onChange={handleChange} />
                </Form.Group>

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
                    <Form.Control type="password" name="password" placeholder="Mayor a 4 caracteres" onChange={handleChange} />
                    {(passwordError && password.length > 1) && <Form.Text className="text-muted-personalized">
                        Ingrese una contraseña con más de 4 caracteres.
                    </Form.Text>}
                </Form.Group>
                <Form.Group controlId="formBasicPassword">
                    <Form.Label className="login-form-tittles">Repetir contraseña</Form.Label>
                    <Form.Control type="password" name="password-repeat" placeholder="Mayor a 4 caracteres" onChange={handleChange} />
                    {(!passwordDiferent && passwordRepeat.length > 1) && <Form.Text className="text-muted-personalized">
                        Las contraseñas no coinciden.
                    </Form.Text>}
                    {(passwordError && password.length > 1) && <Form.Text className="text-muted-personalized">
                        Ingrese una contraseña con más de 4 caracteres.
                    </Form.Text>}
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
        </div>
    )
}