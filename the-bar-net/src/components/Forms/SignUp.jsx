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

export default function SignUp({ adminMode, user, finalizarCompra, handleFinalizarCompra, showDatosEnvio = true }) {
    const { setIsLogged } = useContext(TheNetBar.Context);

    const [type, setType] = useState("");
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
            const userNew = {
                nombre: name,
                apellido: surname,
                dni: dni,
                cuit: cuit,
                email: email,
                password: password,
                telefono: caracteristica + ' ' + telephone,
                direccion: direccion,
                localidad: localidad,
                provincia: provincia,
                codigoPostal: cp,
                confiable: "yes",
                // tipo: "cliente"
                tipo: adminMode ? type : user ? user.tipo : "cliente"
            };
            console.log("sign up", userNew, user);
            // fetch 
            if (user) {
                // PUT to update user
                if (finalizarCompra) {
                    handleFinalizarCompra({ ...userNew, tipo: 'cliente' });
                }
            } else {
                fetch(TheBarNetServerUrl.users, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    mode: 'cors', // no-cors
                    body: JSON.stringify(userNew)
                }).then(res => res.json())
                    .catch(error => console.error('Error:', error))
                    .then(response => {
                        if (response.rta === "added") {
                            history.push({ 
                                pathname: "/login",
                                state: email
                            });
                        } else if (response.rta === "added") {
                            setTryAgainText("Ese usuario ya se encuentra registrado en el sistema!");
                        } else {
                            setTryAgainText("Algo salió mal, por favor intente de nuevo!");
                        }
                    });
            }
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
        } else if (adminMode && value.target.name === "type") {
            setType(value.target.value);
        }
    }, [adminMode]);

    useEffect(() => {
        if (user) {
            setName(user.nombre);
            setSurname(user.apellido);
            setDni(user.dni.toString());
            setCuit(user.cuit.toString());
            // setCaracteristica(user.caracteristica);
            setTelephone(user.telefono.toString());
            setDireccion(user.direccion);
            setLocalidad(user.localidad);
            setProvincia(user.provincia);
            setCp(user.codigoPostal.toString());
            setEmail(user.email);
            setPassword(user.password);
            setPasswordRepeat(user.password);

            setMailError(false);
            setPasswordError(false);
            setPasswordDifferent(false);
            setTryAgainText("");

            setSubmitDisabled(false);
            console.log(user)
        }
    }, [user]);

    const validName = name.length > 1;
    const validSurname = surname.length > 1;
    const validDNI = dni.length === 8;
    const validCuit = cuit.length === 11;
    const validCaracteristica = user ? true : (caracteristica.length > 0 && caracteristica.length < 5);
    const validTelephone = telephone.length > 5 && telephone.length < 13;
    const validDireccion = direccion.length > 0;
    const validLocalidad = localidad.length > 0;
    const validProvincia = provincia.length > 0;
    const validCp = cp.length > 0 && cp.length < 5;
    const validPass = password.length > 4;

    useEffect(() => {
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
    }, [caracteristica, cp, cuit, direccion, dni, email, localidad, name, password, passwordRepeat, provincia, setSubmitDisabled, surname, telephone, user, validCaracteristica, validCp, validCuit, validDNI, validDireccion, validLocalidad, validName, validPass, validProvincia, validSurname, validTelephone]);


    return (
        <div style={{ height: "100%" }}>
            {!user && <h1 className="login-form-tittle">Registro de Cuenta</h1>}
            <Form className={user ? "login-form-pop-up" : "login-form"}>
                <br />
                <br />
                <Form.Group controlId="formBasicName" className="inline-name-surname">
                    <Form.Label className="login-form-tittles">Nombre</Form.Label>
                    <Form.Control type="text" name="name" onChange={handleChange} isValid={validName}
                        defaultValue={user ? name : ""} />
                </Form.Group>
                <Form.Group controlId="formBasicSurname">
                    <Form.Label className="login-form-tittles">Apellido</Form.Label>
                    <Form.Control type="text" name="surname" onChange={handleChange} isValid={validSurname}
                        defaultValue={user ? surname : ""} />
                </Form.Group>

                <Form.Group controlId="formBasicDni">
                    <Form.Label className="login-form-tittles">DNI (sin puntos ni comas)</Form.Label>
                    <Form.Control type="number" name="dni" onChange={handleChange} isValid={validDNI}
                        defaultValue={user ? dni : ""} />
                </Form.Group>
                <Form.Group controlId="formBasicCuit">
                    <Form.Label className="login-form-tittles">Cuit (sin guiones)</Form.Label>
                    <Form.Control type="number" name="cuit" onChange={handleChange} isValid={validCuit}
                        defaultValue={user ? cuit : ""} />
                </Form.Group>
                <Form.Group controlId="formBasicTelephone">
                    <Form.Label className="login-form-tittles">Telefono con característica</Form.Label>
                    <div style={{ display: 'flex' }}>
                        {user
                            ? <Form.Control type="number" name="telephone" onChange={handleChange} isValid={validTelephone}
                                defaultValue={user ? telephone : ""} />
                            : <>
                                <Form.Control type="number" name="telephone_caracteristica" onChange={handleChange} style={{ width: '100px' }} isValid={validCaracteristica} />
                                <Form.Control type="number" name="telephone" onChange={handleChange} isValid={validTelephone} />
                            </>
                        }
                    </div>
                </Form.Group>

                <Form.Group controlId="formBasicEmail">
                    <Form.Label className="login-form-tittles">Email</Form.Label>
                    <Form.Control
                        type="email"
                        name="email"
                        isValid={mailError}
                        onChange={handleChange}
                        defaultValue={user ? email : ""}
                    />
                    {(!mailError && email.length > 1) && <Form.Text className="text-muted-personalized">
                        Ingrese un mail válido.
                    </Form.Text>}
                </Form.Group>

                {showDatosEnvio && <>
                    <Form.Group controlId="formBasicAddress" className="inline-name-surname">
                        <Form.Label className="login-form-tittles">Dirección</Form.Label>
                        <Form.Control type="text" name="direccion" onChange={handleChange} isValid={validDireccion}
                            defaultValue={user ? direccion : ""} />
                    </Form.Group>
                    <Form.Group controlId="formBasicLocalidad">
                        <Form.Label className="login-form-tittles">Localidad</Form.Label>
                        <Form.Control type="text" name="localidad" onChange={handleChange} isValid={validLocalidad}
                            defaultValue={user ? localidad : ""} />
                    </Form.Group>
                    <Form.Group controlId="formBasicProvincia">
                        <Form.Label className="login-form-tittles">Provincia</Form.Label>
                        <Form.Control type="text" name="provincia" onChange={handleChange} isValid={validProvincia}
                            defaultValue={user ? provincia : ""} />
                    </Form.Group>
                    <br />
                    <Form.Group controlId="formBasicCp">
                        <div style={{ display: 'flex' }}>
                            <Form.Label className="login-form-tittles" style={{ width: '60%' }}>Código Postal</Form.Label>
                            <Form.Control type="number" name="cp" onChange={handleChange} style={{ width: '40%' }}
                                isValid={validCp}
                                defaultValue={user ? cp : ""}
                            />
                        </div>
                    </Form.Group>
                </>}
                <br />
                {(adminMode && !finalizarCompra) &&
                    <Form.Group controlId="formBasicType">
                        <Form.Control as="select" onChange={handleChange} id="type">
                            <option key='encargado'>Encargado</option>
                            <option key='empleado'>Empleado</option>
                            <option key='repartidor'>Repartidor</option>
                            <option key='usuario' defaultValue>Usuario</option>
                        </Form.Control>
                    </Form.Group>
                }
                {!finalizarCompra && <>
                    <Form.Group controlId="formBasicPassword">
                        <Form.Label className="login-form-tittles">Contraseña</Form.Label>
                        <Form.Control type="password" name="password" onChange={handleChange} isValid={!passwordError && password.length > 1}
                            defaultValue={user ? password : ""}
                        />
                        {(passwordError && password.length > 1) && <Form.Text className="text-muted-personalized">
                            Ingrese una contraseña con más de 4 caracteres.
                        </Form.Text>}
                    </Form.Group>
                    <Form.Group controlId="formBasicPasswordRepeat">
                        <Form.Label className="login-form-tittles">Repetir contraseña</Form.Label>
                        <Form.Control type="password" name="password-repeat" onChange={handleChange} isValid={passwordDiferent && passwordRepeat.length > 1}
                            defaultValue={user ? passwordRepeat : ""}
                        />
                        {(!passwordDiferent && passwordRepeat.length > 1) && <Form.Text className="text-muted-personalized">
                            Las contraseñas no coinciden.
                        </Form.Text>}
                        {(passwordError && password.length > 1) && <Form.Text className="text-muted-personalized">
                            Ingrese una contraseña con más de 4 caracteres.
                        </Form.Text>}
                    </Form.Group>
                </>}
                <Form.Text className="text-muted-personalized">{tryAgainText}</Form.Text>

                <br />
                {submitDisabled && <Form.Text className="text-muted-personalized">
                    Complete todos los campos, por favor!
                </Form.Text>}
                <br />

                <Button onClick={handleSubmit} disabled={submitDisabled} className="personalized-button">
                    {finalizarCompra ? 'Continuar' : 'Guardar'}
                </Button>
                <br />
                <br />
                {!finalizarCompra && <Nav.Link href="/login" className={"login"}>
                    Ya tengo cuenta
                </Nav.Link>}
            </Form>
            <br />
            <br />
            <br />
            <br />
        </div>
    )
}