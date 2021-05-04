import React, { useCallback } from 'react';
import './styles.css';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import logoTheBarNet from "../utils/images/logo_the_bar_net.png";
import logoCarrito from "../utils/images/logo_carrito.png";
import { useHistory, useLocation } from 'react-router';

export const Header = ({ user, isLogged, carritoTotal, type, setIsLogged }) => {
    const { pathname } = useLocation();
    const history = useHistory();

    const handleLogOut = useCallback(() => {
        setIsLogged(false);
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
                    isLogged ? (
                        type === "admin" ?
                            <>
                            </>
                            : <>
                                <Nav.Link href="/not-found" className={"header-letters"}>MI CUENTA</Nav.Link>
                                <Nav.Link onClick={handleLogOut} className={"header-letters"}>CERRAR SESIÓN</Nav.Link>
                            </>
                    ) : (
                        pathname !== "/login" && <Nav.Link href="/login" className={"header-letters"}>INICIAR SESIÓN</Nav.Link>
                    )
                }
                {
                    type !== "admin" &&
                    <Nav.Link href="/not-found" className={"header-letters"}>
                        <img
                            alt="The Bar Net"
                            src={logoCarrito}
                            height="30"
                            width="30"
                            className="d-inline-block align-top"
                        />
                        {' '}${carritoTotal || 0}
                    </Nav.Link>
                }
            </Navbar.Collapse>
        </Navbar >
    )
}