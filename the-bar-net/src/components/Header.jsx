import React, { useCallback } from 'react';
import './styles.css';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import logoTheBarNet from "../utils/images/logo_the_bar_net.png";
import logoCarrito from "../utils/images/logo_carrito.png";
import { useHistory, useLocation } from 'react-router';

export const Header = ({ user, isLogged, carritoTotal, setIsLogged }) => {
    const { pathname } = useLocation();
    const history = useHistory();

    const handleLogOut = useCallback(() => {
        setIsLogged(false, null);
        history.push("/home");
    }, [history, setIsLogged]);

    return (
        <Navbar className={"header-style"}>
            <Navbar.Brand href="/home">
                <img
                    alt="The Bar Net"
                    src={logoTheBarNet}
                    height="30"
                    className="d-inline-block align-top"
                />{' '}
            </Navbar.Brand>
            <Navbar.Collapse className="justify-content-end">
                <Nav.Link href="/home" className={"header-letters"}>INICIO</Nav.Link>
                {
                    isLogged !== null ? (
                        user.tipo === "admin" ?
                            <>
                                <Nav.Link onClick={handleLogOut} className={"header-letters"}>CERRAR SESIÓN</Nav.Link>
                            </>
                        : user.tipo === "encargado" ?
                            <>
                                <Nav.Link onClick={handleLogOut} className={"header-letters"}>CERRAR SESIÓN</Nav.Link>
                            </>
                        : user.tipo === "repartidor" ?
                            <>
                                <Nav.Link onClick={handleLogOut} className={"header-letters"}>CERRAR SESIÓN</Nav.Link>
                            </>
                        : <> {/* for users */}
                            <Nav.Link href="/mis-pedidos" className={"header-letters"}>MIS PEDIDOS</Nav.Link>
                            <Nav.Link onClick={handleLogOut} className={"header-letters"}>CERRAR SESIÓN</Nav.Link>
                        </>
                    ) : (
                        pathname !== "/login" && <Nav.Link href="/login" className={"header-letters"}>INICIAR SESIÓN</Nav.Link>
                    )
                }
                {
                    // (user.tipo !== "admin" && isLogged !== null) &&
                    (isLogged === null || user.tipo === "cliente") &&
                    <div className={"header-letters"} onClick={() => history.push("/carrito")}>
                        <img
                            alt="The Bar Net"
                            src={logoCarrito}
                            height="30"
                            width="30"
                            className="d-inline-block align-top"
                        />
                        {' '}${carritoTotal || 0}
                    </div>
                }
            </Navbar.Collapse>
        </Navbar >
    )
}