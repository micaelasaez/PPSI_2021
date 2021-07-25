import React, { useCallback, useEffect, useState } from 'react';
import '../styles.css';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Nav from 'react-bootstrap/Nav';
import { useHistory } from 'react-router';
import { TheBarNetServerUrl } from '../context/Url';
import Select from 'react-select';

const validateEmail = (mail) => {
    if (/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(mail)) {
        return true;
    }
    return false;
}

export default function SignUp({ adminMode, empleadoMode, user, finalizarCompra, handleFinalizarCompra,
    showDatosEnvio = true, continuarDisabled = false, close, changeView }) {

    const [preciosEnvio, setPreciosEnvio] = useState([]);
    const [localidades, setLocalidades] = useState([]);
    const [type, setType] = useState("");
    const [name, setName] = useState("");
    const [surname, setSurname] = useState("");
    const [dni, setDni] = useState("");
    const [cuit, setCuit] = useState("");
    const [caracteristica, setCaracteristica] = useState("");
    const [telephone, setTelephone] = useState("");
    const [direccion, setDireccion] = useState("");
    const [localidad, setLocalidad] = useState({ value: 1, label: "CABA" });
    const [provincia, setProvincia] = useState("Buenos Aires");
    const [cp, setCp] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [passwordRepeat, setPasswordRepeat] = useState("");
    const [confiable, setConfiable] = useState('yes');

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
                telefono: caracteristica + telephone,
                direccion: direccion,
                // localidad is precioEnvio id 
                localidad: localidad.value,
                provincia: provincia,
                codigoPostal: cp,
                confiable: confiable,
                // tipo: "cliente"
                tipo: adminMode ? type : user ? user.tipo : "cliente"
            };
            console.log("sign up", userNew, user);
            // fetch 
            if (user) {
                // PUT to update user
                if (finalizarCompra) {
                    userNew.tipo = 'cliente';
                }
                fetch(TheBarNetServerUrl.users + '/' + user.id, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    mode: 'cors', // no-cors
                    body: JSON.stringify(userNew)
                }).then(res => res.json())
                    .catch(error => console.error('Error:', error))
                    .then(response => {
                        if (close) {
                            // alert();
                            close('El usuario fue actualizado correctamente');
                        }
                    });
                if (finalizarCompra) {
                    handleFinalizarCompra(userNew, preciosEnvio.find(pEnvio => pEnvio.id === localidad.value)?.precio);
                }
            } else {
                fetch(TheBarNetServerUrl.users, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    mode: 'cors', // no-cors
                    body: JSON.stringify({ ...userNew, confiable: 'yes' })
                }).then(res => res.json())
                    .catch(error => console.error('Error:', error))
                    .then(response => {
                        if (response.rta === "added") {
                            if (!adminMode) {
                                history.push({
                                    pathname: "/login",
                                    state: email
                                });
                            } else {
                                //history.push('/home-admin')
                                //alert('creado')
                                changeView();
                            }
                        } else if (response.rta === "registered email") {
                            setTryAgainText("Ese email ya se encuentra registrado en el sistema!");
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
            // } else if (value.target.name === "localidad") {
            //     setLocalidad(value.target.value);
            // } else if (value.target.name === "provincia") {
            // setProvincia(value.target.value);
        } else if (value.target.name === "cp") {
            setCp(value.target.value);
        } else if (value.target.name === "dni") {
            setDni(value.target.value);
        } else if (adminMode && value.target.name === "type") {
            setType(value.target.value);
        } else if (empleadoMode && value.target.name === "confiable") {
            setConfiable(value.target.value);
        }
    }, [adminMode, empleadoMode]);

    const handleChangeLocalidad = useCallback((localidadItem) => {
        console.log(localidadItem)
        setLocalidad(localidadItem);
    }, []);

    useEffect(() => {
        if (user) {
            setName(user.nombre);
            setSurname(user.apellido);
            setDni(user.dni.toString());
            setCuit(user.cuit.toString());
            // setCaracteristica(user.caracteristica);
            setTelephone(user.telefono.toString());
            setDireccion(user.direccion);
            setProvincia(user.provincia);
            setCp(user.codigoPostal.toString());
            setEmail(user.email);
            setPassword(user.password);
            setPasswordRepeat(user.password);

            setMailError(true);
            setPasswordError(false);
            setPasswordDifferent(false);
            setTryAgainText("");

            setSubmitDisabled(continuarDisabled);
            console.log(user)
        }
        fetch(TheBarNetServerUrl.preciosEnvios, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
            mode: 'cors'
        }).then(res => res.json())
            .then(response => {
                setPreciosEnvio(response.rta);
                const localidadesToSet = response.rta.map(l => ({
                    value: l.id,
                    label: l.localidad
                }));
                if (user) {
                    if (finalizarCompra) {
                        setLocalidad(localidadesToSet.find(l => l.value === Number.parseInt(user.localidad)));
                    } else {
                        setLocalidad(localidadesToSet.find(l => l.label === user.localidad));
                    }
                }
                setLocalidades(localidadesToSet);
            });

    }, [continuarDisabled, finalizarCompra, user]);

    const validName = name.length > 1;
    const validSurname = surname.length > 1;
    const validDNI = dni.length === 8;
    const validCuit = cuit.length === 11;
    const validCaracteristica = user ? true : (caracteristica.length > 0 && caracteristica.length < 5);
    const validTelephone = telephone.length > 5 && telephone.length < 15;
    const validDireccion = direccion.length > 0;
    // const validLocalidad = localidad.length > 0;
    const validLocalidad = localidad !== '';
    const validProvincia = provincia.length > 0;
    const validCp = cp.length > 0 && cp.length < 5;
    const validPass = user ? true : password.length > 4;

    useEffect(() => {
        setPasswordError(!validPass);
        const validPassRepeat = user ? true : password === passwordRepeat;
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
                <Form.Group className="inline-name-surname">
                    <Form.Label className="login-form-tittles">Nombre</Form.Label>
                    <Form.Control type="text" name="name" onChange={handleChange} isValid={validName}
                        defaultValue={user ? name : ""} />
                </Form.Group>
                <Form.Group>
                    <Form.Label className="login-form-tittles">Apellido</Form.Label>
                    <Form.Control type="text" name="surname" onChange={handleChange} isValid={validSurname}
                        defaultValue={user ? surname : ""} />
                </Form.Group>

                <Form.Group>
                    <Form.Label className="login-form-tittles">DNI (sin puntos ni comas)</Form.Label>
                    <Form.Control type="number" name="dni" onChange={handleChange} isValid={validDNI}
                        defaultValue={user ? dni : ""} />
                </Form.Group>
                <Form.Group>
                    <Form.Label className="login-form-tittles">Cuit (sin guiones)</Form.Label>
                    <Form.Control type="number" name="cuit" onChange={handleChange} isValid={validCuit}
                        defaultValue={user ? cuit : ""} />
                </Form.Group>
                <Form.Group>
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

                <Form.Group>
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
                    <Form.Group className="inline-name-surname">
                        <Form.Label className="login-form-tittles">Dirección</Form.Label>
                        <Form.Control type="text" name="direccion" onChange={handleChange} isValid={validDireccion}
                            defaultValue={user ? direccion : ""} />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label className="login-form-tittles">Localidad</Form.Label>
                        {/* <Form.Control type="text" name="localidad" onChange={handleChange} isValid={validLocalidad}
                            defaultValue={user ? localidad : ""} /> */}
                        {/* <Form.Control as="select" onChange={handleChange} id="localidad" name="localidad"> */}
                        {/* {localidades.map(l => (
                                <option key={l.id} value={l.localidad}>{l.localidad}</option>

                            ))} */}
                        <Select
                            value={localidad}
                            options={localidades}
                            onChange={handleChangeLocalidad}
                            isSearchable
                        />
                        {
                            finalizarCompra &&
                            <Form.Text style={{ fontSize: 'larger' }}>
                                Cargo por envío: {' $' + preciosEnvio.find(pEnvio => pEnvio.id === localidad.value)?.precio}
                            </Form.Text>
                        }
                    </Form.Group>
                    <Form.Group>
                        <Form.Label className="login-form-tittles">Provincia</Form.Label>
                        {/* <Form.Control type="text" name="provincia" onChange={handleChange} isValid={validProvincia} 
                            // defaultValue={user ? provincia : ""} />*/}
                        {/* defaultValue={"Buenos Aires"} disabled /> */}
                        <Form.Control as="select" onChange={handleChange} id="provincia" name="provincia">
                            <option key={1} value={'Buenos Aires'}>Buenos Aires</option>
                        </Form.Control>
                    </Form.Group>
                    <br />
                    <Form.Group>
                        <div style={{ display: 'flex' }}>
                            <Form.Label className="login-form-tittles" style={{ width: '60%' }}>Código Postal</Form.Label>
                            <Form.Control type="number" name="cp" onChange={handleChange} style={{ width: '40%' }}
                                isValid={validCp}
                                defaultValue={user ? cp : ""}
                            />
                        </div>
                    </Form.Group>
                    {/* {
                        finalizarCompra && (
                            // show agregado por envio al CP o si no hay envio a ese CP
                            // + change en el submit
                        )
                    } */}
                </>}
                <br />
                {(adminMode && !finalizarCompra) &&
                    <Form.Group>
                        <Form.Control as="select" onChange={handleChange} id="type" name="type">
                            <option key='encargado' value='encargado'>Encargado</option>
                            <option key='empleado' value='empleado'>Empleado</option>
                            <option key='repartidor' value='repartidor'>Repartidor</option>
                            <option key='cliente' value='cliente' defaultValue>Cliente</option>
                        </Form.Control>
                    </Form.Group>
                }
                {(empleadoMode && user) &&
                    <Form.Group>
                        <Form.Label className="login-form-tittles">¿Es confiable?</Form.Label>
                        {user.confiable === 'yes'
                            ? <>
                                <Form.Control as="select" onChange={handleChange} id="confiable" name="confiable">
                                    <option key='yes' value='yes' defaultChecked>SI</option>
                                    <option key='no' value='no'>NO</option>
                                </Form.Control>
                            </>
                            : <>
                                <Form.Control as="select" onChange={handleChange} id="confiable" name="confiable">
                                    <option key='no' value='no' defaultChecked>NO</option>
                                    <option key='yes' value='yes'>SI</option>
                                </Form.Control>
                            </>
                        }
                    </Form.Group>
                }
                {(!finalizarCompra && !user) && <>
                    <Form.Group>
                        <Form.Label className="login-form-tittles">Contraseña</Form.Label>
                        <Form.Control type="password" name="password" onChange={handleChange} isValid={!passwordError && password.length > 1}
                            defaultValue={user ? password : ""}
                        />
                        {(passwordError && password.length > 1) && <Form.Text className="text-muted-personalized">
                            Ingrese una contraseña con más de 4 caracteres.
                        </Form.Text>}
                    </Form.Group>
                    <Form.Group>
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
                {(!finalizarCompra && !user && !adminMode) && <Nav.Link href="/login" className={"login"}>
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