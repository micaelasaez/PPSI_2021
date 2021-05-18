import React, { useCallback, useContext, useEffect, useState } from 'react';
import '../styles.css';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Nav from 'react-bootstrap/Nav';
import { useHistory } from 'react-router';
import { TheNetBar } from '../context/TheNetBarContext';
import { TheBarNetServerUrl } from '../context/Url';

const validateEmail = (mail) => {
    if (/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(mail)) {
        return true;
    }
    return false;
}

export default function SignUp() {
    const { setIsLogged } = useContext(TheNetBar.Context);
    
    const [name, setName] = useState("");
    const [surname, setSurname] = useState("");
    const [dni, setDni] = useState("");
    const [cuit, setCuit] = useState("");
    const [caracteristica, setCaracteristica] = useState("");
    const [telephone, setTelephone] = useState("");
    const [direccion, setDireccion] = useState("");
    const [localidad, setLocalidad] = useState("");
    const [provincia, setProvincia] = useState("");
    const [cp, setCp] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [passwordRepeat, setPasswordRepeat] = useState("");
    
    const [mailError, setMailError] = useState(false);
    const [passwordError, setPasswordError] = useState("");
    const [passwordDiferent, setPasswordDifferent] = useState("");
    const [tryAgainText, setTryAgainText] = useState("");
    
    const [submitDisabled, setSubmitDisabled] = useState(true);
    const history = useHistory();

    const handleSubmit = async () => {
        if (!submitDisabled) {
            const user = {
                nombre: name,
                apellido: surname,
                dni: dni,
                cuit: cuit,
                email: email,
                password: password,
                telefono: caracteristica + telephone,
                direccion: direccion,
                localidad: localidad,
                provincia: provincia,
                codigoPostal: cp,
                confiable: "yes",
                tipo: "cliente"
            };
            console.log("logged in", user);
            // fetch 
            const response = await fetch(TheBarNetServerUrl.users, {
                method: 'POST',
                mode: 'no-cors',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: JSON.stringify(user)
            })
            console.log(response.rta);
            // const data = await response.json();
            // console.log(data)


            // setIsLogged
            // setIsLogged(true);
            // history.push("/home");

            // else
            // set try again text
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
        } else if (value.target.name === "cuit") {
            setCuit(value.target.value);
        } else if (value.target.name === "telephone_caracteristica") {
            setCaracteristica(value.target.value);
        } else if (value.target.name === "telephone") {
            setTelephone(value.target.value);
        } else if (value.target.name === "direccion") {
            setDireccion(value.target.value);
        } else if (value.target.name === "localidad") {
            setLocalidad(value.target.value);
        } else if (value.target.name === "provincia") {
            setProvincia(value.target.value);
        } else if (value.target.name === "cp") {
            setCp(value.target.value);
        } else if (value.target.name === "dni") {
            setDni(value.target.value);
        }
    }, []);

    useEffect(() => {
        const validName = name.length > 1;
        const validSurname = surname.length > 1;
        const validDNI = dni.length > 1 && dni.length < 9;
        const validCuit = cuit.length === 11;
        const validCaracteristica = caracteristica.length > 0 && caracteristica.length < 5;
        const validTelephone = telephone.length > 5 && telephone.length < 13;
        const validDireccion = direccion.length > 0;
        const validLocalidad = localidad.length > 0;
        const validProvincia = provincia.length > 0;
        const validCp = cp.length > 0 && cp.length < 5;
        const validPass = password.length > 4;
        setPasswordError(!validPass);
        const validPassRepeat = password === passwordRepeat;
        setPasswordDifferent(validPassRepeat);
        const validMail = validateEmail(email);
        setMailError(validMail);

        if (validMail && validPass && validName && validSurname && validDNI && validPassRepeat && validCuit && validCaracteristica 
            && validTelephone && validDireccion && validLocalidad && validCp && validProvincia) {
            setSubmitDisabled(false);
        } else {
            setSubmitDisabled(true);
        }
    }, [caracteristica.length, cp.length, cuit.length, direccion.length, dni.length, email, localidad.length, name.length, password, passwordRepeat, provincia.length, setSubmitDisabled, surname.length, telephone.length]);


    return (
        <div style={{ height: "100%" }}>
            <h1 className="login-form-tittle">Registro de Cuenta</h1>
            <Form className="login-form">
                <br />
                <br />
                <Form.Group controlId="formBasicName" className="inline-name-surname">
                    <Form.Label className="login-form-tittles">Nombre</Form.Label>
                    <Form.Control type="text" name="name" placeholder="" onChange={handleChange} isValid={name.length > 1}/>
                </Form.Group>
                <Form.Group controlId="formBasicSurname">
                    <Form.Label className="login-form-tittles">Apellido</Form.Label>
                    <Form.Control type="text" name="surname" placeholder="" onChange={handleChange} isValid={surname.length > 1}/>
                </Form.Group>

                <Form.Group controlId="formBasicDni">
                    <Form.Label className="login-form-tittles">DNI (sin puntos ni comas)</Form.Label>
                    <Form.Control type="number" name="dni" placeholder="12345678" onChange={handleChange} isValid={dni.length > 1 && dni.length < 9}/>
                </Form.Group>
                <Form.Group controlId="formBasicCuit">
                    <Form.Label className="login-form-tittles">Cuit (sin guiones)</Form.Label>
                    <Form.Control type="number" name="cuit" placeholder="12 34567890 1" onChange={handleChange} isValid={cuit.length === 11}/>
                </Form.Group>
                <Form.Group controlId="formBasicTelephone">
                    <Form.Label className="login-form-tittles">Telefono con característica</Form.Label>
                    <div style={{ display: 'flex' }}>
                        <Form.Control type="number" name="telephone_caracteristica" placeholder="011" onChange={handleChange} style={{ width: '100px' }} isValid={caracteristica.length > 0 && caracteristica.length < 5}/>
                        <Form.Control type="number" name="telephone" placeholder="12345678" onChange={handleChange} isValid={telephone.length > 5 && telephone.length < 13}/>
                    </div>
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


                <Form.Group controlId="formBasicAddress" className="inline-name-surname">
                    <Form.Label className="login-form-tittles">Dirección</Form.Label>
                    <Form.Control type="text" name="direccion" placeholder="Mitre 650" onChange={handleChange} isValid={direccion.length > 0}/>
                </Form.Group>
                <Form.Group controlId="formBasicLocalidad">
                    <Form.Label className="login-form-tittles">Localidad</Form.Label>
                    <Form.Control type="text" name="localidad" placeholder="Avellaneda" onChange={handleChange} isValid={localidad.length > 0}/>
                </Form.Group>
                <Form.Group controlId="formBasicProvincia">
                    <Form.Label className="login-form-tittles">Provincia</Form.Label>
                    <Form.Control type="text" name="provincia" placeholder="Buenos Aires" onChange={handleChange} isValid={provincia.length > 0}/>
                </Form.Group>
                <br />
                <Form.Group controlId="formBasicCp">
                    <div style={{ display: 'flex' }}>
                        <Form.Label className="login-form-tittles" style={{ width: '60%' }}>Código Postal</Form.Label>
                        <Form.Control type="number" name="cp" placeholder="1825" onChange={handleChange} style={{ width: '40%' }} isValid={cp.length > 0 && cp.length < 5}/>
                    </div>
                </Form.Group>
                <br />
                <Form.Group controlId="formBasicPassword">
                    <Form.Label className="login-form-tittles">Contraseña</Form.Label>
                    <Form.Control type="password" name="password" placeholder="Mayor a 4 caracteres" onChange={handleChange} isValid={!passwordError && password.length > 1}/>
                    {(passwordError && password.length > 1) && <Form.Text className="text-muted-personalized">
                        Ingrese una contraseña con más de 4 caracteres.
                    </Form.Text>}
                </Form.Group>
                <Form.Group controlId="formBasicPasswordRepeat">
                    <Form.Label className="login-form-tittles">Repetir contraseña</Form.Label>
                    <Form.Control type="password" name="password-repeat" placeholder="Mayor a 4 caracteres" onChange={handleChange} isValid={passwordDiferent && passwordRepeat.length > 1} />
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
                {submitDisabled && <Form.Text className="text-muted-personalized">
                    Complete todos los campos, por favor!                    
                </Form.Text>}
                <br />
                <Button onClick={handleSubmit} disabled={submitDisabled} className="personalized-button">
                    Ingresar
                </Button>
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